import { useTokenPrices } from '@generationsoftware/hyperstructure-react-hooks'
import { Token } from '@shared/types'
import { USDC_TOKEN_ADDRESSES } from '@shared/utilities'
import { useMemo } from 'react'
import { SupportedNetwork } from 'src/types'
import { Address, parseUnits } from 'viem'
import { NETWORK_CONFIG } from '@constants/config'

/**
 * Returns a target auction price for an auction
 * @param prizeToken the prize token of the relevant prize pool
 * @returns
 */
export const useLiquidationPairTargetAuctionPrice = (prizeToken: Token) => {
  const chainId = prizeToken?.chainId as SupportedNetwork

  const { data: tokenPrices, isFetched: isFetchedTokenPrices } = useTokenPrices(
    chainId,
    !!prizeToken ? [prizeToken.address, USDC_TOKEN_ADDRESSES[chainId]] : []
  )

  const data = useMemo(() => {
    if (!!prizeToken && !!tokenPrices) {
      const prizeTokenPrice = tokenPrices[prizeToken.address.toLowerCase() as Address]
      const usdcPrice = tokenPrices[USDC_TOKEN_ADDRESSES[chainId]]

      if (!!prizeTokenPrice && !!usdcPrice) {
        const prizeTokenPriceUsd = prizeTokenPrice / usdcPrice
        const numTokens = NETWORK_CONFIG[chainId].lp.targetAuctionPriceUsd / prizeTokenPriceUsd

        return parseUnits(numTokens.toFixed(18), prizeToken.decimals)
      }
    }
  }, [prizeToken, tokenPrices])

  const isFetched = !!prizeToken && isFetchedTokenPrices

  return { data, isFetched }
}
