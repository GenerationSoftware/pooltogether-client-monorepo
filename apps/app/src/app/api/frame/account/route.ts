import { FrameButton, FrameRequest } from '@shared/types'
import { NETWORK } from '@shared/utilities'
import { type NextRequest, NextResponse } from 'next/server'
import { Address, createPublicClient, http, isAddress } from 'viem'
import { getEnsAddress } from 'viem/actions'
import { mainnet } from 'viem/chains'
import { normalize } from 'viem/ens'
import { APP_URL, RPC_URLS } from '@constants/config'

export const dynamic = 'force-dynamic'

interface FrameState {
  view: 'account' | 'prizes'
  userAddress: Address
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const frameRequest: FrameRequest = await req.json()

  const prevState: Partial<FrameState> = !!frameRequest.untrustedData.state
    ? JSON.parse(frameRequest.untrustedData.state)
    : undefined

  if (!!prevState) {
    const userAddress = prevState.userAddress

    if (!!userAddress) {
      // TODO: display account or prizes depending on prevState and buttonIndex
      return dynamicAccountFrame(userAddress)
    } else {
      return initialFrame()
    }
  } else {
    const fixedUser = req.nextUrl.searchParams.get('user')
    const dynamicUser = frameRequest.untrustedData.inputText

    if (!!fixedUser) {
      const userAddress = await getUserAddress(fixedUser)

      if (!!userAddress) {
        return fixedAccountFrame(userAddress)
      } else {
        return errorResponse('Invalid User')
      }
    } else if (!!dynamicUser) {
      const userAddress = await getUserAddress(dynamicUser)

      if (!!userAddress) {
        return dynamicAccountFrame(userAddress)
      } else {
        // TODO: return some sort of error screen and allow the user to re-enter an address/ens
        return errorResponse('Invalid User')
      }
    }
  }

  return errorResponse('User Not Found')
}

// TODO: get initial frame image (same as `AccountFrame`)
const initialFrame = () => {
  return frameResponse({
    img: `${APP_URL}/facebook-share-image-1200-630.png`,
    buttons: [{ content: 'Check Account' }],
    input: { placeholder: 'Enter an address or ENS...' }
  })
}

// TODO: get dynamic image displaying user vault balances
const fixedAccountFrame = (userAddress: Address) => {
  return frameResponse({
    img: `${APP_URL}/facebook-share-image-1200-630.png`,
    buttons: [{ content: 'Check Latest Prizes' }],
    state: { view: 'account', userAddress }
  })
}

// TODO: get dynamic image displaying user vault balances
const dynamicAccountFrame = (userAddress: Address) => {
  return frameResponse({
    img: `${APP_URL}/facebook-share-image-1200-630.png`,
    buttons: [
      { content: 'Switch Account' },
      { content: 'Check Latest Prizes' },
      { content: 'View on App', action: 'link', target: `${APP_URL}/account/${userAddress}` }
    ],
    state: { view: 'account', userAddress }
  })
}

const frameResponse = (data: {
  img: string
  buttons: FrameButton[]
  input?: { placeholder: string }
  state?: FrameState
}) => {
  const { img, buttons, input, state } = data

  let frame = `<!DOCTYPE html>
    <html><head>
    <meta property='fc:frame' content='vNext' />
    <meta property='og:image' content='${img}' />
    <meta property='fc:frame:image' content='${img}' />
    <meta name='fc:frame:post_url' content='${APP_URL}/api/frame/account' />
    <meta name='fc:frame:state' content='${JSON.stringify(state)}' />
  `

  if (!!input) {
    frame += `<meta name='fc:frame:input:text' content='${input.placeholder}' />`
  }

  buttons.forEach((button, i) => {
    frame += `<meta name='fc:frame:button:${i + 1}' content='${button.content}' />`

    if (!!button.action) {
      frame += `<meta name='fc:frame:button:${i + 1}:action' content='${button.action}' />`

      if (button.action === 'link' || button.action === 'mint' || button.action === 'tx') {
        frame += `<meta name='fc:frame:button:${i + 1}:target' content='${button.target}' />`

        if (button.action === 'tx') {
          frame += `<meta name='fc:frame:button:${i + 1}:post_url' content='${button.callback}' />`
        }
      }
    }
  })

  frame += '</head></html>'

  return new NextResponse(frame, { status: 200 })
}

const errorResponse = (message: string) => {
  return NextResponse.json({ message }, { status: 418 })
}

const getUserAddress = async (user: string) => {
  if (isAddress(user)) return user

  if (user.endsWith('.eth')) {
    const client = createPublicClient({
      chain: mainnet,
      transport: http(RPC_URLS[NETWORK.mainnet])
    })

    const address = await getEnsAddress(client, { name: normalize(user) })

    return address ?? undefined
  }
}
