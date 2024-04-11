import { FrameRequest } from '@shared/types'
import { type NextRequest, NextResponse } from 'next/server'
import { Address } from 'viem'
import { APP_URL } from '@constants/config'
import { frameResponse, getUserAddress } from '../utils'

export const dynamic = 'force-dynamic'

const postUrl = `${APP_URL}/api/frame/account`

export interface FrameState {
  view: 'welcome' | 'account' | 'wins'
  user?: { name: string; address: Address }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const frameRequest: FrameRequest = await req.json()

  const prevState = !!frameRequest.untrustedData.state
    ? (JSON.parse(frameRequest.untrustedData.state) as FrameState)
    : undefined

  const userInput = frameRequest.untrustedData.inputText?.trim()
  const buttonClicked = frameRequest.untrustedData.buttonIndex

  if (!prevState) {
    if (!!userInput) {
      const userAddress = await getUserAddress(userInput)

      if (!!userAddress) {
        return frame(undefined, { user: { name: userInput, address: userAddress } })
      }
    }

    return frame()
  }

  let user = prevState.user

  if (prevState.view === 'welcome' && !prevState.user && !!userInput) {
    const userAddress = await getUserAddress(userInput)

    if (!!userAddress) {
      user = { name: userInput, address: userAddress }
    }
  }

  return frame(prevState, { user, buttonClicked })
}

interface FrameData {
  user?: { name: string; address: Address }
  buttonClicked?: number
}

const frame = (prevState?: FrameState, data?: FrameData) => {
  const { user, buttonClicked } = data ?? {}

  if (!!user) {
    if (prevState?.view === 'account' && buttonClicked === 1) {
      return welcomeView()
    } else if (prevState?.view === 'account' && buttonClicked === 2) {
      return winsView({ user })
    } else {
      return accountView({ user })
    }
  } else if (!prevState || prevState.view === 'welcome') {
    return welcomeView({ isInvalidAddress: true })
  } else {
    return welcomeView()
  }
}

const welcomeView = (data?: { isInvalidAddress?: boolean }) => {
  const { isInvalidAddress } = data ?? {}

  const imgSrc = isInvalidAddress
    ? `${APP_URL}/facebook-share-image-1200-630.png` // TODO: get static welcome img with error msg
    : `${APP_URL}/facebook-share-image-1200-630.png` // TODO: get static welcome img (same as in AccountFrame)

  return frameResponse<FrameState>({
    img: { src: imgSrc },
    postUrl,
    buttons: [{ content: 'Check Account' }],
    input: { placeholder: 'Enter an address or ENS...' },
    state: { view: 'welcome' }
  })
}

const accountView = (data: { user: NonNullable<FrameData['user']> }) => {
  const { user } = data

  const imgSrc = new URL(`${postUrl}/image`)
  imgSrc.searchParams.set('view', 'account')
  imgSrc.searchParams.set('userName', user.name)
  imgSrc.searchParams.set('userAddress', user.address)

  return frameResponse<FrameState>({
    img: { src: imgSrc.toString(), aspectRatio: '1:1' },
    postUrl,
    buttons: [
      { content: 'Switch Account' },
      { content: 'Check Wins' },
      { content: 'View on App', action: 'link', target: `${APP_URL}/account/${user.name}` }
    ],
    state: { view: 'account', user }
  })
}

const winsView = (data: { user: NonNullable<FrameData['user']> }) => {
  const { user } = data

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
