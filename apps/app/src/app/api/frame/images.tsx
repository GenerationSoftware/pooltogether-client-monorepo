import { TokenWithLogo } from '@shared/types'
import { getVaultId, NETWORK, WRAPPED_NATIVE_ASSETS } from '@shared/utilities'
import { Address } from 'viem'
import { CabanaLogo, Card, FrameImage, UserCard, VaultBalance, Win } from './components'
import { getAllUserLastPrizes, getAllUserVaultBalances, imageResponse } from './utils'

export const accountViewImg = async (data: { userName: string | null; userAddress: Address }) => {
  const { userName, userAddress } = data

  const vaultBalances = await getAllUserVaultBalances(userAddress)

  const balancesToDisplay = vaultBalances.filter((token) => token.amount > 0n)

  return imageResponse(
    <FrameImage>
      <Card style={{ width: '100%', flexGrow: 1, gap: '8px' }}>
        <span>Balances:</span>
        {balancesToDisplay.map((token) => (
          <VaultBalance key={getVaultId(token)} token={token} />
        ))}
        {!balancesToDisplay.length && <span style={{ fontSize: 24 }}>None</span>}
      </Card>
      <div style={{ width: '100%', display: 'flex', gap: '32px', alignItems: 'center' }}>
        <CabanaLogo style={{ flexShrink: 1, padding: '16px' }} />
        <UserCard user={userName ?? userAddress} />
      </div>
    </FrameImage>
  )
}

export const winsViewImg = async (data: { userName: string | null; userAddress: Address }) => {
  const { userName, userAddress } = data

  const wins = await getAllUserLastPrizes(userAddress)

  const winsToDisplay = wins.filter((win) => win.payout > 0n).slice(0, 5)

  // TODO: should not assume all prize pools have WETH as the prize token
  const getPrizeToken = (chainId: NETWORK): TokenWithLogo => {
    return {
      chainId,
      address: WRAPPED_NATIVE_ASSETS[chainId] as Address,
      symbol: 'WETH',
      name: 'Wrapped Ether',
      decimals: 18,
      logoURI: 'https://etherscan.io/token/images/weth_28.png'
    }
  }

  return imageResponse(
    <FrameImage>
      <Card style={{ width: '100%', flexGrow: 1, gap: '8px' }}>
        <span>Recent Wins:</span>
        {winsToDisplay.map((win) => (
          <Win key={`${win.network}-${win.id}`} win={win} prizeToken={getPrizeToken(win.network)} />
        ))}
        {!winsToDisplay.length && <span style={{ fontSize: 24 }}>None yet</span>}
      </Card>
      <div style={{ width: '100%', display: 'flex', gap: '32px', alignItems: 'center' }}>
        <CabanaLogo style={{ flexShrink: 1, padding: '16px' }} />
        <UserCard user={userName ?? userAddress} />
      </div>
    </FrameImage>
  )
}
