import { VaultList } from '@shared/types'
import { NETWORK } from '@shared/utilities'

export const testnetVaults: VaultList['tokens'] = [
  {
    chainId: NETWORK.optimism_sepolia,
    address: '0xFaA0a8f7A7621A0Add12ddcFE940b3c634BD088e',
    name: 'Prize DAI - LY',
    decimals: 18,
    symbol: 'PDAI-LY',
    logoURI: 'https://assets.coingecko.com/coins/images/9956/small/4943.png?1636636734',
    extensions: {
      underlyingAsset: {
        address: '0x3eb488d3419496742963437378C2130a2EdcB87d',
        symbol: 'DAI',
        name: 'Dai Stablecoin'
      }
    }
  },
  {
    chainId: NETWORK.optimism_sepolia,
    address: '0xaB9f23574e0722b52fF67db1B49A5385066612CB',
    name: 'Prize DAI - HY',
    decimals: 18,
    symbol: 'PDAI-HY',
    logoURI: 'https://assets.coingecko.com/coins/images/9956/small/4943.png?1636636734',
    extensions: {
      underlyingAsset: {
        address: '0x3eb488d3419496742963437378C2130a2EdcB87d',
        symbol: 'DAI',
        name: 'Dai Stablecoin'
      }
    }
  },
  {
    chainId: NETWORK.optimism_sepolia,
    address: '0x6d02b0CE229ABEe2f155248E66d8E090d3C86BB2',
    name: 'Prize USDC - LY',
    decimals: 6,
    symbol: 'PUSDC-LY',
    logoURI: 'https://etherscan.io/token/images/centre-usdc_28.png',
    extensions: {
      underlyingAsset: {
        address: '0x01ce79e045539F560AFa57943DB6CFF3FB097c4b',
        symbol: 'USDC',
        name: 'USD Coin'
      }
    }
  },
  {
    chainId: NETWORK.optimism_sepolia,
    address: '0x0eC4EbfbED7599640e8AA3E76F46BB5A29d42827',
    name: 'Prize USDC - HY',
    decimals: 6,
    symbol: 'PUSDC-HY',
    logoURI: 'https://etherscan.io/token/images/centre-usdc_28.png',
    extensions: {
      underlyingAsset: {
        address: '0x01ce79e045539F560AFa57943DB6CFF3FB097c4b',
        symbol: 'USDC',
        name: 'USD Coin'
      }
    }
  },
  {
    chainId: NETWORK.optimism_sepolia,
    address: '0x14b0c4f45Fe1BcC41DfA1C901D3dD1323735CDF3',
    name: 'Prize GUSD',
    decimals: 2,
    symbol: 'PGUSD',
    logoURI:
      'https://assets.coingecko.com/coins/images/5992/small/gemini-dollar-gusd.png?1536745278',
    extensions: {
      underlyingAsset: {
        address: '0xF0F496Dc0558E9744963292eFFf344725218B1F5',
        symbol: 'GUSD',
        name: 'Gemini dollar'
      }
    }
  },
  {
    chainId: NETWORK.optimism_sepolia,
    address: '0xbc5405249D568A18C41714D32c9b3bC6521D3DD6',
    name: 'Prize WBTC',
    decimals: 8,
    symbol: 'PWBTC',
    logoURI: 'https://etherscan.io/token/images/wbtc_28.png?v=1',
    extensions: {
      underlyingAsset: {
        address: '0xC21D6c8dD430CC97Aaa58391625B82f4681AE473',
        symbol: 'WBTC',
        name: 'Wrapped BTC'
      }
    }
  },
  {
    chainId: NETWORK.optimism_sepolia,
    address: '0x3e5bC94A341481F742F5f573D341fA2540bC0992',
    name: 'Prize WETH',
    decimals: 18,
    symbol: 'PWETH',
    logoURI: 'https://etherscan.io/token/images/weth_28.png',
    extensions: {
      underlyingAsset: {
        address: '0x0845842Ad2DCE40b83EddECf9C67df2C75caB844',
        symbol: 'WETH',
        name: 'Wrapped Ether'
      }
    }
  }
]
