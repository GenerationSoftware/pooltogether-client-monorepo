export interface PoolTogetherApiGasPrices {
  SafeGasPrice: number
  ProposeGasPrice: number
  FastGasPrice: number
}

export interface GasCostEstimates {
  totalGasWei: bigint
  totalGasEth: number
}
