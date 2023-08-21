import { formatBigIntForDisplay, TokenWithAmount } from '@pooltogether/hyperstructure-client-js'
import { useToken } from '@pooltogether/hyperstructure-react-hooks'
import { Spinner } from '@shared/ui'
import classNames from 'classnames'
import { Address } from 'viem'
import { TokenValue, TokenValueProps } from './TokenValue'

export interface TokenValueAndAmountProps {
  token: { chainId: number; address: Address } & Partial<TokenWithAmount>
  valueOptions?: Omit<TokenValueProps, 'token' | 'fallback'>
  amountOptions?: Intl.NumberFormatOptions & {
    locale?: string
    round?: boolean
    hideZeroes?: boolean
  }
  className?: string
  valueClassName?: string
  amountClassName?: string
}

export const TokenValueAndAmount = (props: TokenValueAndAmountProps) => {
  const { token, valueOptions, amountOptions, className, valueClassName, amountClassName } = props

  const { data: tokenData, isFetching: isFetchingTokenData } = useToken(
    token.chainId,
    token.address
  )

  const amount = token.amount ?? 0n
  const decimals = token.decimals ?? tokenData?.decimals
  const symbol = token.symbol ?? tokenData?.symbol

  if (isFetchingTokenData || decimals === undefined || !symbol) {
    return <Spinner />
  }

  return (
    <div className={classNames('flex flex-col items-center', className)}>
      <span className={valueClassName}>
        <TokenValue token={token} fallback={<></>} {...valueOptions} />
      </span>
      <span className={classNames('text-pt-purple-200', amountClassName)}>
        {formatBigIntForDisplay(amount, decimals, amountOptions)} {symbol}
      </span>
    </div>
  )
}
