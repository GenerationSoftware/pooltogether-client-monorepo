import { NextRequest, NextResponse } from 'next/server'
import {
  getChainIdFromParams,
  getPrizePool,
  getVault,
  getVaultAddressFromParams,
  getVaultData
} from './utils'

export interface VaultApiParams {
  chainId: string
  vaultAddress: string
}

export async function GET(
  _req: NextRequest,
  ctx: { params: VaultApiParams }
): Promise<NextResponse> {
  const chainId = getChainIdFromParams(ctx.params)
  const vaultAddress = getVaultAddressFromParams(ctx.params)

  if (!chainId) {
    return NextResponse.json({ message: 'Invalid network' }, { status: 400 })
  }

  if (!vaultAddress) {
    return NextResponse.json({ message: 'Invalid vault address' }, { status: 400 })
  }

  try {
    const vault = getVault(chainId, vaultAddress)
    const prizePool = getPrizePool(vault)
    const vaultData = await getVaultData(vault, prizePool)

    return NextResponse.json(vaultData, { status: 200 })
  } catch (e: any) {
    if (!(e instanceof Error)) {
      e = new Error(e as string)
    }

    return NextResponse.json(
      { message: 'Could not fetch vault data', error: e.message },
      { status: 500 }
    )
  }
}
