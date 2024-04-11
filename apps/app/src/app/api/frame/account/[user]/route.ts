import { FrameRequest } from '@shared/types'
import { type NextRequest, NextResponse } from 'next/server'
import { Address } from 'viem'
import { APP_URL } from '@constants/config'
import { errorResponse, frameResponse, getUserAddress } from '../../utils'

export const dynamic = 'force-dynamic'

export interface FrameState {
  view: 'account' | 'wins'
  user: { name: string; address: Address }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { user: string } }
): Promise<NextResponse> {
  const postUrl = `${APP_URL}/api/frame/account/${params.user}`

  const frameRequest: FrameRequest = await req.json()

  const prevState = !!frameRequest.untrustedData.state
    ? (JSON.parse(frameRequest.untrustedData.state) as FrameState)
    : undefined

  if (!prevState) {
    const userAddress = await getUserAddress(params.user)

    if (!!userAddress) {
      return frame(postUrl, undefined, { user: { name: params.user, address: userAddress } })
    } else {
      return errorResponse('Invalid User')
    }
  }

  return frame(postUrl, prevState, {
    user: { name: params.user, address: prevState.user?.address },
    buttonClicked: frameRequest.untrustedData.buttonIndex
  })
}

interface FrameData {
  user: { name: string; address: Address }
  buttonClicked?: number
}

const frame = (postUrl: string, prevState: FrameState | undefined, data: FrameData) => {
  const { user, buttonClicked } = data

  if (prevState?.view === 'account' && buttonClicked === 1) {
    return winsView({ postUrl, user })
  } else {
    return accountView({ postUrl, user })
  }
}

const accountView = async (data: { postUrl: string; user: FrameData['user'] }) => {
  const { postUrl, user } = data

  const imgSrc = new URL(`${postUrl}/image`)
  imgSrc.searchParams.set('view', 'account')
  imgSrc.searchParams.set('userName', user.name)
  imgSrc.searchParams.set('userAddress', user.address)

  return frameResponse<FrameState>({
    img: { src: imgSrc.toString(), aspectRatio: '1:1' },
    postUrl,
    buttons: [
      { content: 'Check Wins' },
      { content: 'View on App', action: 'link', target: `${APP_URL}/account/${user.name}` }
    ],
    state: { view: 'account', user }
  })
}

const winsView = (data: { postUrl: string; user: FrameData['user'] }) => {
  const { postUrl, user } = data

  const imgSrc = new URL(`${postUrl}/image`)
  imgSrc.searchParams.set('view', 'wins')
  imgSrc.searchParams.set('userName', user.name)
  imgSrc.searchParams.set('userAddress', user.address)

  return frameResponse<FrameState>({
    img: { src: imgSrc.toString(), aspectRatio: '1:1' },
    postUrl,
    buttons: [{ content: 'Back' }],
    state: { view: 'wins', user }
  })
}
