import { VaultList } from '@shared/types'
import { NETWORK } from '@shared/utilities'

export const testnetVaults: VaultList['tokens'] = [
  {
    chainId: NETWORK.optimism_sepolia,
    address: '0x52B0AC5c447dD84C37B85c2Fc36A5b23bb4c9868',
    name: 'Prize POOL',
    decimals: 18,
    symbol: 'pPOOL',
    logoURI: 'https://etherscan.io/token/images/pooltogether_32.png',
    extensions: {
      underlyingAsset: {
        address: '0x358c07AB17AAF8933778fea01CD5E02411E3f9a1',
        symbol: 'POOL',
        name: 'PoolTogether'
      }
    }
  },
  {
    chainId: NETWORK.optimism_sepolia,
    address: '0x0d03E25f761F4bCfFc5A58dfF7dAe49531a4C351',
    name: 'Prize DAI',
    decimals: 18,
    symbol: 'pDAI',
    logoURI: 'https://assets.coingecko.com/coins/images/9956/small/4943.png?1636636734',
    extensions: {
      underlyingAsset: {
        address: '0x661482c49b1c36C6D5bda27f3a062Cf090F3fC8D',
        symbol: 'DAI',
        name: 'Dai Stablecoin'
      }
    }
  },
  {
    chainId: NETWORK.optimism_sepolia,
    address: '0xea47F7735eAF6b1E6502c21f50F65E84f7dAA824',
    name: 'Prize USDC',
    decimals: 6,
    symbol: 'pUSDC',
    logoURI: 'https://etherscan.io/token/images/centre-usdc_28.png',
    extensions: {
      underlyingAsset: {
        address: '0x523e046612880dbf9558A0E4555cE445C825C36a',
        symbol: 'USDC',
        name: 'USD Coin'
      }
    }
  },
  {
    chainId: NETWORK.optimism_sepolia,
    address: '0x58d2cFF1d2587C611C190F0e3958f25aDf98Ee49',
    name: 'Prize GUSD',
    decimals: 2,
    symbol: 'pGUSD',
    logoURI:
      'https://assets.coingecko.com/coins/images/5992/small/gemini-dollar-gusd.png?1536745278',
    extensions: {
      underlyingAsset: {
        address: '0x8cdc43adD489dbc75ddD24F1B5eC0De897E99dfF',
        symbol: 'GUSD',
        name: 'Gemini Dollar'
      }
    }
  },
  {
    chainId: NETWORK.optimism_sepolia,
    address: '0x7f30E01095b4E9Dd05acA8C83b016a5c0Bb79A80',
    name: 'Prize WBTC',
    decimals: 8,
    symbol: 'pWBTC',
    logoURI: 'https://etherscan.io/token/images/wbtc_28.png?v=1',
    extensions: {
      underlyingAsset: {
        address: '0x95513Dc166123445636dF2575C62d326e094Be3c',
        symbol: 'WBTC',
        name: 'Wrapped Bitcoin'
      }
    }
  },
  {
    chainId: NETWORK.optimism_sepolia,
    address: '0x80436148E5fAb18b58A33B24F79977D6934fF0e4',
    name: 'Prize WETH',
    decimals: 18,
    symbol: 'pWETH',
    logoURI: 'https://etherscan.io/token/images/weth_28.png',
    extensions: {
      underlyingAsset: {
        address: '0x058C8222f77978f4e3Fa3aC1914cd541A1F882Cc',
        symbol: 'WETH',
        name: 'Wrapped Ether'
      }
    }
  }
]
