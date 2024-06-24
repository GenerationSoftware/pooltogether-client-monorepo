import { NextResponse } from 'next/server'

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    { message: 'Missing <chainId> and <vaultAddress> in /api/<chainId>/<vaultAddress>' },
    { status: 400 }
  )
}
