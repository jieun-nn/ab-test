import { NextRequest, NextResponse } from 'next/server'
import { encode } from 'next-auth/jwt'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const baseUrl = `${requestUrl.protocol}//${requestUrl.host}`
  const { searchParams } = requestUrl
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  if (error) {
    return NextResponse.redirect(`${baseUrl}/login?error=figma_denied`)
  }

  if (!code || !state) {
    return NextResponse.redirect(`${baseUrl}/login?error=figma_missing_params`)
  }

  const savedState = request.cookies.get('figma_oauth_state')?.value
  if (!savedState || savedState !== state) {
    console.error('State mismatch:', { savedState, state })
    return NextResponse.redirect(`${baseUrl}/login?error=figma_state_mismatch`)
  }

  const redirectUri = `${baseUrl}/api/figma-oauth/callback`

  try {
    const body = new URLSearchParams({
      client_id: process.env.AUTH_FIGMA_ID!,
      client_secret: process.env.AUTH_FIGMA_SECRET!,
      redirect_uri: redirectUri,
      code: code,
      grant_type: 'authorization_code',
    })

    const tokenRes = await fetch('https://api.figma.com/v1/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    })

    const tokenText = await tokenRes.text()
    console.log('Figma token response:', tokenRes.status, tokenText)

    if (!tokenRes.ok) {
      return NextResponse.redirect(`${baseUrl}/login?error=figma_token_failed`)
    }

    const tokens = JSON.parse(tokenText)
    const accessToken: string = tokens.access_token

    const userRes = await fetch('https://api.figma.com/v1/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    if (!userRes.ok) {
      return NextResponse.redirect(`${baseUrl}/login?error=figma_userinfo_failed`)
    }

    const figmaUser = await userRes.json()

    const jwtPayload = {
      sub: String(figmaUser.id),
      name: figmaUser.handle,
      email: figmaUser.email,
      picture: figmaUser.img_url,
      provider: 'figma',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
    }

    // HTTPS(production)에서는 __Secure- 접두사 사용 (NextAuth v5 규칙)
    const isSecure = requestUrl.protocol === 'https:'
    const cookieName = isSecure ? '__Secure-authjs.session-token' : 'authjs.session-token'

    const sessionToken = await encode({
      token: jwtPayload,
      secret: process.env.AUTH_SECRET!,
      salt: cookieName,
    })

    const response = NextResponse.redirect(`${baseUrl}/workspace`)

    response.cookies.delete('figma_oauth_state')
    response.cookies.set(cookieName, sessionToken, {
      httpOnly: true,
      secure: isSecure,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    })

    return response
  } catch (err) {
    console.error('Figma OAuth callback error:', err)
    return NextResponse.redirect(`${baseUrl}/login?error=figma_callback_error`)
  }
}
