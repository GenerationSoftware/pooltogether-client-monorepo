export interface Token {
  chainId: number
  address: `0x${string}`
  symbol: string
  name: string
  decimals: number
}

export interface TokenWithPrice extends Token {
  price: number
}

export interface TokenWithLogo extends Token {
  logoURI: string
}

export interface TokenWithSupply extends Token {
  totalSupply: bigint
}

export interface TokenWithAmount extends Token {
  amount: bigint
}
