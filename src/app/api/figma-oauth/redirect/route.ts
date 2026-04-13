import { NextResponse } from 'next/server'
import { randomBytes } from 'crypto'

function getBaseUrl() {
  if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return 'http://localhost:3000'
}

export async function GET() {
  const state = randomBytes(32).toString('hex')
  const baseUrl = getBaseUrl()

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
