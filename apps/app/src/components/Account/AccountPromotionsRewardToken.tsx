import { useToken } from '@generationsoftware/hyperstructure-react-hooks'
import { TokenIcon } from '@shared/react-components'
import { Spinner } from '@shared/ui'
import { Address } from 'viem'

interface AccountPromotionsRewardTokenProps {
  chainId: number
  tokenAddress: Address
}

export const AccountPromotionsRewardToken = (props: AccountPromotionsRewardTokenProps) => {
  const { chainId, tokenAddress } = props

  const { data: tokenData } = useToken(chainId, tokenAddress)

  if (!tokenData) {
    return <Spinner />
  }

  return (
    <span className='inline-flex gap-2 items-center'>
      <TokenIcon token={tokenData} />
      {tokenData.symbol}
    </span>
  )
}
