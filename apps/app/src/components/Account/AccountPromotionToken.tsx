import { useToken } from '@generationsoftware/hyperstructure-react-hooks'
import { TokenIcon } from '@shared/react-components'
import { Spinner } from '@shared/ui'
import classNames from 'classnames'
import { Address } from 'viem'

interface AccountPromotionTokenProps {
  chainId: number
  tokenAddress: Address
  className?: string
}

export const AccountPromotionToken = (props: AccountPromotionTokenProps) => {
  const { chainId, tokenAddress, className } = props

  const { data: tokenData } = useToken(chainId, tokenAddress)

  if (!tokenData) {
    return <Spinner />
  }

  return (
    <span
      className={classNames(
        'inline-flex gap-1 items-center text-sm md:gap-2 md:text-base',
        className
      )}
    >
      <TokenIcon token={tokenData} />
      {tokenData.symbol}
    </span>
  )
}
