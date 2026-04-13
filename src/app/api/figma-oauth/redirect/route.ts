import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'

export async function GET(request: NextRequest) {
  const state = randomBytes(32).toString('hex')
  const { protocol, host } = new URL(request.url)
  const baseUrl = `${protocol}//${host}`

  const params = new URLSearchParams({
    client_id: process.env.AUTH_FIGMA_ID!,
    redirect_uri: `${baseUrl}/api/figma-oauth/callback`,
    scope: 'current_user:read',
    state,
    response_type: 'code',
  })

  const figmaAuthUrl = `https://www.figma.com/oauth?${params.toString()}`

  const response = NextResponse.redirect(figmaAuthUrl)

  // state를 쿠키에 저장 (CSRF 방지)
  response.cookies.set('figma_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10, // 10분
    path: '/',
  })

  return response
}
