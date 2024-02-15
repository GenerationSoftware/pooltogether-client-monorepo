import { CoingeckoExchangeRates } from '@shared/types'
import { getCoingeckoExchangeRates } from '@shared/utilities'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { QUERY_KEYS } from '../constants/keys'
import { NO_REFETCH } from '../constants/query'

/**
 * Returns exchange rates from CoinGecko
 * @returns
 */
export const useCoingeckoExchangeRates = (): UseQueryResult<CoingeckoExchangeRates> => {
  return useQuery({
    queryKey: [QUERY_KEYS.coingeckoExchangeRates],
    queryFn: async () => await getCoingeckoExchangeRates(),
    staleTime: Infinity,
    enabled: true,
    ...NO_REFETCH
  })
}
