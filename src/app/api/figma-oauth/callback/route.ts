import { NextRequest, NextResponse } from 'next/server'
import { encode } from 'next-auth/jwt'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  // 에러 처리
  if (error) {
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/login?error=figma_denied`
    )
  }

  if (!code || !state) {
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/login?error=figma_missing_params`
    )
  }

  // state 검증
  const savedState = request.cookies.get('figma_oauth_state')?.value
  if (!savedState || savedState !== state) {
    console.error('State mismatch:', { savedState, state })
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/login?error=figma_state_mismatch`
    )
  }

  const redirectUri = `${process.env.NEXTAUTH_URL}/api/figma-oauth/callback`

  try {
    // 1. Figma 토큰 교환 — form body 방식으로 전송
    const body = new URLSearchParams({
      client_id: process.env.AUTH_FIGMA_ID!,
      client_secret: process.env.AUTH_FIGMA_SECRET!,
      redirect_uri: redirectUri,
      code: code,
      grant_type: 'authorization_code',
    })

    console.log('Figma token request URL:', 'https://www.figma.com/api/oauth/token')
    console.log('Figma token body:', body.toString())

    const tokenRes = await fetch('https://api.figma.com/v1/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    })

    const tokenText = await tokenRes.text()
    console.log('Figma token response:', tokenRes.status, tokenText)

    if (!tokenRes.ok) {
      console.error('Figma token exchange failed:', tokenRes.status, tokenText)
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/login?error=figma_token_failed`
      )
    }

    const tokens = JSON.parse(tokenText)
    const accessToken: string = tokens.access_token

    // 2. Figma 유저 정보 가져오기
    const userRes = await fetch('https://api.figma.com/v1/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    if (!userRes.ok) {
      console.error('Figma userinfo failed:', userRes.status)
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/login?error=figma_userinfo_failed`
      )
    }

    const figmaUser = await userRes.json()
    console.log('Figma user:', figmaUser)

    // 3. NextAuth 호환 JWT 생성
    const jwtPayload = {
      sub: String(figmaUser.id),
      name: figmaUser.handle,
      email: figmaUser.email,
      picture: figmaUser.img_url,
      provider: 'figma',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30일
    }

    const sessionToken = await encode({
      token: jwtPayload,
      secret: process.env.AUTH_SECRET!,
      salt: 'authjs.session-token',
    })

    // 4. 세션 쿠키 설정 후 워크스페이스로 이동
    const response = NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/workspace`
    )

    response.cookies.delete('figma_oauth_state')

    response.cookies.set('authjs.session-token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30일
      path: '/',
    })

    return response
  } catch (err) {
    console.error('Figma OAuth callback error:', err)
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/login?error=figma_callback_error`
    )
  }
}
