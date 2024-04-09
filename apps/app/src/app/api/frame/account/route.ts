import { FrameRequest } from '@shared/types'
import { type NextRequest, NextResponse } from 'next/server'
import { Address } from 'viem'
import { APP_URL } from '@constants/config'
import { frameResponse, getUserAddress } from '../utils'

export const dynamic = 'force-dynamic'

const postUrl = `${APP_URL}/api/frame/account`

interface FrameState {
  view: 'welcome' | 'account' | 'prizes'
  user?: { name: string; address: Address }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const frameRequest: FrameRequest = await req.json()

  const prevState = !!frameRequest.untrustedData.state
    ? (JSON.parse(frameRequest.untrustedData.state) as FrameState)
    : undefined

  if (!prevState) {
    const userInput = frameRequest.untrustedData.inputText

    if (!!userInput) {
      const userAddress = await getUserAddress(userInput)

      if (!!userAddress) {
        return frame(undefined, { user: { name: userInput, address: userAddress } })
      }
    }

    return frame()
  }

  return frame(prevState, {
    user: prevState.user,
    buttonClicked: frameRequest.untrustedData.buttonIndex
  })
}

interface FrameData {
  user?: { name: string; address: Address }
  buttonClicked?: number
}

const frame = (prevState?: FrameState, data?: FrameData) => {
  const { user, buttonClicked } = data ?? {}

  // TODO: route to different views depending on prevState and buttonClicked

  if (!!user) {
    return accountView({ user })
  } else if (!prevState || prevState.view === 'welcome') {
    return welcomeView({ isInvalidAddress: true })
  } else {
    return welcomeView()
  }
}

const welcomeView = (data?: { isInvalidAddress?: boolean }) => {
  const { isInvalidAddress } = data ?? {}

  const img = isInvalidAddress
    ? `${APP_URL}/facebook-share-image-1200-630.png` // TODO: get static welcome img with error msg
    : `${APP_URL}/facebook-share-image-1200-630.png` // TODO: get static welcome img (same as in AccountFrame)

  return frameResponse<FrameState>({
    img,
    postUrl,
    buttons: [{ content: 'Check Account' }],
    input: { placeholder: 'Enter an address or ENS...' },
    state: { view: 'welcome' }
  })
}

const accountView = (data: { user: NonNullable<FrameData['user']> }) => {
  const { user } = data

  return frameResponse<FrameState>({
    img: `${APP_URL}/facebook-share-image-1200-630.png`, // TODO: get dynamic account img
    postUrl,
    buttons: [
      { content: 'Switch Account' },
      { content: 'Check Latest Prizes' },
      { content: 'View on App', action: 'link', target: `${APP_URL}/account/${user.address}` }
    ],
    state: { view: 'account', user }
  })
}
