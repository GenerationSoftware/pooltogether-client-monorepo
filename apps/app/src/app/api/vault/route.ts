import { NextResponse } from 'next/server'

export function GET(): NextResponse {
  return NextResponse.json(
    { message: 'Missing <chainId> and <vaultAddress> in /api/vault/<chainId>/<vaultAddress>' },
    { status: 400 }
  )
}
