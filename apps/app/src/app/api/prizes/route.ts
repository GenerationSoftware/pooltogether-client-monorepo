import { NextResponse } from 'next/server'

export function GET(): NextResponse {
  return NextResponse.json(
    { message: 'Missing <chainId> in /api/prizes/<chainId>' },
    { status: 400 }
  )
}
