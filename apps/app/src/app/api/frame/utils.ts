import { FrameButton, VaultInfo } from '@shared/types'
import { getTokenBalances, NETWORK } from '@shared/utilities'
import { NextResponse } from 'next/server'
import { Address, createPublicClient, http, isAddress, PublicClient } from 'viem'
import { getEnsAddress, normalize } from 'viem/ens'
import { RPC_URLS, WAGMI_CHAINS } from '@constants/config'

export const frameResponse = <FrameStateType extends {}>(data: {
  img: string
  postUrl: string
  buttons: FrameButton[]
  input?: { placeholder: string }
  state?: FrameStateType
}) => {
  const { img, postUrl, buttons, input, state } = data

  let frame = `<!DOCTYPE html>
    <html><head>
    <meta property='fc:frame' content='vNext' />
    <meta property='og:image' content='${img}' />
    <meta property='fc:frame:image' content='${img}' />
    <meta name='fc:frame:post_url' content='${postUrl}' />
  `

  if (!!state) {
    frame += `<meta name='fc:frame:state' content='${JSON.stringify(state)}' />`
  }

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

export const errorResponse = (message: string) => {
  return NextResponse.json({ message }, { status: 418 })
}

export const getUserAddress = async (user: string) => {
  if (isAddress(user)) return user

  if (user.endsWith('.eth')) {
    const client = createPublicClient({
      chain: WAGMI_CHAINS[NETWORK.mainnet],
      transport: http(RPC_URLS[NETWORK.mainnet])
    })

    const address = await getEnsAddress(client, { name: normalize(user) })

    return address ?? undefined
  }
}

export const getUserVaultBalances = (
  network: NETWORK,
  userAddress: Address,
  vaults: VaultInfo[]
) => {
  const client = createPublicClient({
    chain: WAGMI_CHAINS[network as keyof typeof WAGMI_CHAINS],
    transport: http(RPC_URLS[network as keyof typeof RPC_URLS])
  }) as PublicClient

  const vaultAddresses = vaults.filter((v) => v.chainId === network).map((v) => v.address)

  return getTokenBalances(client, userAddress, vaultAddresses)
}
