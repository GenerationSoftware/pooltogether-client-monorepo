import { FrameRequest, TokenWithAmount } from '@shared/types'
import { NETWORK } from '@shared/utilities'
import { type NextRequest, NextResponse } from 'next/server'
import { Address } from 'viem'
import { APP_URL, DEFAULT_VAULT_LISTS } from '@constants/config'
import { errorResponse, frameResponse, getUserAddress, getUserVaultBalances } from '../../utils'

export const dynamic = 'force-dynamic'

interface FrameState {
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

  const vaults = DEFAULT_VAULT_LISTS.default.tokens
  const networks = [...new Set<NETWORK>(vaults.map((v) => v.chainId))]

  const vaultBalances: { [network: number]: { [vaultAddress: Address]: TokenWithAmount } } = {}

  await Promise.allSettled(
    networks.map((network) =>
      (async () => {
        const balances = await getUserVaultBalances(network, user.address, vaults)

        Object.entries(balances).forEach(([vaultAddress, balance]) => {
          if (vaultBalances[network] === undefined) {
            vaultBalances[network] = {}
          }

          vaultBalances[network][vaultAddress as Address] = balance
        })
      })()
    )
  )

  return frameResponse<FrameState>({
    img: `${APP_URL}/facebook-share-image-1200-630.png`, // TODO: get dynamic account img
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

  return frameResponse<FrameState>({
    img: `${APP_URL}/facebook-share-image-1200-630.png`, // TODO: get dynamic wins img
    postUrl,
    buttons: [{ content: 'Back' }],
    state: { view: 'wins', user }
  })
}
