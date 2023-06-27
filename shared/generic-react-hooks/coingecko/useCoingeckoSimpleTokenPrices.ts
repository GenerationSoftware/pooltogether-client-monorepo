import { CoingeckoTokenPrices } from '@shared/types'
import { getCoingeckoSimpleTokenPrices } from '@shared/utilities'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { CURRENCY_ID } from '../constants/currencies'
import { QUERY_KEYS } from '../constants/keys'
import { NO_REFETCH } from '../constants/query'

/**
 * Returns native token prices from CoinGecko
 * @param currencies optional currency override (default is ['eth'])
 * @returns
 */
export const useCoingeckoSimpleTokenPrices = (
  currencies?: CURRENCY_ID[]
): UseQueryResult<CoingeckoTokenPrices, unknown> => {
  const enabled = currencies === undefined || currencies.length > 0

  return useQuery(
    [QUERY_KEYS.coingeckoSimpleTokenPrices, currencies],
    async () => await getCoingeckoSimpleTokenPrices(currencies),
    {
      staleTime: Infinity,
      enabled,
      ...NO_REFETCH
    }
  )
}
