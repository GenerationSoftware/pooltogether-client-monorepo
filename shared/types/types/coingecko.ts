export interface CoingeckoTokenPrices {
  [id: string]: {
    [currency: string]: number
  }
}

export interface CoingeckoExchangeRates {
  [id: string]: {
    name: string
    unit: string
    value: number
    type: 'crypto' | 'fiat' | 'commodity'
  }
}

export interface CoingeckoTokenData {
  id: string
  symbol: string
  name: string
  asset_platform_id: string
  platforms: Record<string, string>
  detail_platforms: Record<string, { decimal_place: number; contract_address: string }>
  categories: string[]
  links: Record<string, string | string[] | Record<string, string[]>>
  image: { thumb: string; small: string; large: string }
  contract_address: string
  market_cap_rank: number
  coingecko_rank: number
  coingecko_score: number
  developer_score: number
  community_score: number
  liquidity_score: number
  public_interest_score: number
  market_data: CoingeckoTokenMarketData
  last_updated: string
}

export interface CoingeckoTokenMarketData {
  current_price: Record<string, number>
  total_value_locked: Record<string, number>
  mcap_to_tvl_ratio: number
  fdv_to_tvl_ratio: number
  ath: Record<string, number>
  ath_change_percentage: Record<string, number>
  ath_date: Record<string, string>
  atl: Record<string, number>
  atl_change_percentage: Record<string, number>
  atl_date: Record<string, string>
  market_cap: Record<string, number>
  market_cap_rank: number
  fully_diluted_valuation: Record<string, number>
  total_volume: Record<string, number>
  high_24h: Record<string, number>
  low_24h: Record<string, number>
  price_change_24h: number
  price_change_percentage_24h: number
  price_change_percentage_7d: number
  price_change_percentage_14d: number
  price_change_percentage_30d: number
  price_change_percentage_60d: number
  price_change_percentage_200d: number
  price_change_percentage_1y: number
  market_cap_change_24h: number
  market_cap_change_percentage_24h: number
  total_supply: number
  max_supply: number | undefined
  circulating_supply: number
  last_updated: string
}
