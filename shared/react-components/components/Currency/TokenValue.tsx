import { getTokenPriceFromObject, TokenWithAmount } from '@pooltogether/hyperstructure-client-js'
import { useToken, useTokenPrices } from '@pooltogether/hyperstructure-react-hooks'
import { Spinner } from '@shared/ui'
import { useMemo } from 'react'
import { formatUnits } from 'viem'
import { CurrencyValue, CurrencyValueProps } from './CurrencyValue'

export interface TokenValueProps extends Omit<CurrencyValueProps, 'baseValue'> {
  token: { chainId: number; address: `0x${string}` } & Partial<TokenWithAmount>
}

export const TokenValue = (props: TokenValueProps) => {
  const { token, baseCurrency, ...rest } = props

  const { data: tokenData, isFetching: isFetchingTokenData } = useToken(
    token.chainId,
    token.address
  )

  const { data: tokenPrices, isFetching: isFetchingTokenPrices } = useTokenPrices(
    token.chainId,
    [token.address],
    !!baseCurrency ? [baseCurrency] : undefined
  )

  const tokenPrice = !!tokenData
    ? getTokenPriceFromObject(
        token.chainId,
        token.address,
        {
          [token.chainId]: tokenPrices ?? {}
        },
        baseCurrency
      )
    : undefined

  const tokenValue = useMemo(() => {
    if (!!tokenPrice) {
      const amount = token.amount ?? 0n
      const decimals = token.decimals ?? tokenData?.decimals
      if (!!amount && decimals !== undefined) {
        const formattedAmount = parseFloat(formatUnits(amount, decimals))
        return formattedAmount * tokenPrice
      }
    }

    return 0
  }, [token, tokenData])

  if (isFetchingTokenData || isFetchingTokenPrices) {
    return <Spinner />
  }

  return <CurrencyValue baseValue={tokenValue} baseCurrency={baseCurrency} {...rest} />
}
