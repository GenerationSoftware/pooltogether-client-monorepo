import { getVaultId } from '@shared/utilities'
import { NextRequest } from 'next/server'
import { Address, isAddress } from 'viem'
import { CabanaLogo, Card, FrameImage, UserCard, VaultBalance } from '../../../components'
import { errorResponse, getAllUserVaultBalances, imageResponse } from '../../../utils'
import { FrameState } from '../route'

export function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams

  const view = searchParams.get('view') as FrameState['view'] | null
  const userName = searchParams.get('userName')
  const userAddress = searchParams.get('userAddress')

  if (view === 'account' && !!userAddress && isAddress(userAddress)) {
    return accountViewImg({ userName, userAddress })
  }

  return errorResponse('Invalid Request', 400)
}

const accountViewImg = async (data: { userName: string | null; userAddress: Address }) => {
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
      <div
        style={{
          width: '100%',
          display: 'flex',
          gap: '32px',
          alignItems: 'center'
        }}
      >
        <CabanaLogo style={{ flexShrink: 1, padding: '16px' }} />
        <UserCard user={userName ?? userAddress} />
      </div>
    </FrameImage>
  )
}
