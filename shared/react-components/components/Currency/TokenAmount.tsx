import { useToken } from '@pooltogether/hyperstructure-react-hooks'
import { TokenWithAmount } from '@shared/types'
import { Spinner } from '@shared/ui'
import { formatBigIntForDisplay } from '@shared/utilities'
import { Address } from 'viem'

export interface TokenAmountProps extends Omit<Intl.NumberFormatOptions, 'style' | 'currency'> {
  token: { chainId: number; address: Address } & Partial<TokenWithAmount>
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
