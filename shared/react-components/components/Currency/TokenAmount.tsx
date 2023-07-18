import { formatBigIntForDisplay, TokenWithAmount } from '@pooltogether/hyperstructure-client-js'
import { useToken } from '@pooltogether/hyperstructure-react-hooks'
import { Spinner } from '@shared/ui'

export interface TokenAmountProps extends Omit<Intl.NumberFormatOptions, 'style' | 'currency'> {
  token: { chainId: number; address: `0x${string}` } & Partial<TokenWithAmount>
  locale?: string
  round?: boolean
  hideZeroes?: boolean
}

export const TokenAmount = (props: TokenAmountProps) => {
  const { token, ...rest } = props

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
    <>
      {formatBigIntForDisplay(amount, decimals, { ...rest })} {symbol}
    </>
  )
}
