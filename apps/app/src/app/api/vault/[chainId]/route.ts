import { NextRequest, NextResponse } from 'next/server'
import { VaultApiParams } from './[vaultAddress]/route'

export function GET(_req: NextRequest, ctx: { params: VaultApiParams }): NextResponse {
  return NextResponse.json(
    { message: `Missing <vaultAddress> in /api/vault/${ctx.params.chainId}/<vaultAddress>` },
    { status: 400 }
  )
}
