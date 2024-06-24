import { NextRequest, NextResponse } from 'next/server'
import { VaultApiParams } from './[vaultAddress]/route'

export async function GET(
  _req: NextRequest,
  ctx: { params: VaultApiParams }
): Promise<NextResponse> {
  return NextResponse.json(
    { message: `Missing <vaultAddress> in /api/${ctx.params.chainId}/<vaultAddress>` },
    { status: 400 }
  )
}
