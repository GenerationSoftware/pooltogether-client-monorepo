import { NextRequest } from 'next/server'
import { isAddress } from 'viem'
import { accountViewImg, winsViewImg } from '../../../images'
import { errorResponse } from '../../../utils'
import { FrameState } from '../route'

export function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams

  const view = searchParams.get('view') as FrameState['view'] | null
  const userName = searchParams.get('userName')
  const userAddress = searchParams.get('userAddress')

  if (view === 'account' && !!userAddress && isAddress(userAddress)) {
    return accountViewImg({ userName, userAddress })
  } else if (view === 'wins' && !!userAddress && isAddress(userAddress)) {
    return winsViewImg({ userName, userAddress })
  }

  return errorResponse('Invalid Request', 400)
}
