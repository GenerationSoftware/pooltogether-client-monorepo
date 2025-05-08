import { NextRequest, NextResponse } from 'next/server'
import { getChainIdFromParams, getPrizePool, getPrizesData, getPublicClient } from './utils'

export interface PrizesApiParams {
  chainId: string
}

export async function GET(
  req: NextRequest,
  ctx: { params: PrizesApiParams }
): Promise<NextResponse> {
  const chainId = getChainIdFromParams(ctx.params)

  if (!chainId) {
    return NextResponse.json({ message: 'Invalid network' }, { status: 400 })
  }

  try {
    const publicClient = getPublicClient(req, chainId)
    const prizePool = getPrizePool(chainId, publicClient)
    const prizesData = await getPrizesData(req, prizePool)

    return NextResponse.json(prizesData, { status: 200 })
  } catch {
    return NextResponse.json({ message: 'Could not fetch prizes data' }, { status: 500 })
  }
}
