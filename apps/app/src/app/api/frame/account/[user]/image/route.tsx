import { NextRequest } from 'next/server'
import { Address, isAddress } from 'viem'
import { errorResponse, getAllUserVaultBalances, imageResponse } from '../../../utils'
import { FrameState } from '../route'

export function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams

  const view = searchParams.get('view') as FrameState['view'] | null
  const userAddress = searchParams.get('userAddress')

  if (view === 'account' && !!userAddress && isAddress(userAddress)) {
    return accountViewImg({ userAddress })
  }

  return errorResponse('Invalid Request', 400)
}

const accountViewImg = async (data: { userAddress: Address }) => {
  const vaultBalances = await getAllUserVaultBalances(data.userAddress)

  return imageResponse('👋 Hello')
}
