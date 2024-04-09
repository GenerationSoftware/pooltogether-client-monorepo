import { VaultList } from '@shared/types'
import { NETWORK } from '@shared/utilities'

export const testnetVaults: VaultList['tokens'] = [
  {
    chainId: NETWORK.optimism_sepolia,
    address: '0x798A13b071a8AAC2D55109A53a2Ba4230444619d',
    name: 'Prize POOL',
    decimals: 18,
    symbol: 'pPOOL',
    logoURI: 'https://etherscan.io/token/images/pooltogether_32.png',
    extensions: {
      underlyingAsset: {
        address: '0xC923144BB5403c16f05c4D6372bc733d2BD9F9D3',
        symbol: 'POOL',
        name: 'PoolTogether'
      }
    }
  },
  {
    chainId: NETWORK.optimism_sepolia,
    address: '0x5905549D4AC352dd9B3950ca0e0277Ed1284Af73',
    name: 'Prize DAI',
    decimals: 18,
    symbol: 'pDAI',
    logoURI: 'https://assets.coingecko.com/coins/images/9956/small/4943.png?1636636734',
    extensions: {
      underlyingAsset: {
        address: '0x541B588d1EDc43078931C20Fb62983344F808e8e',
        symbol: 'DAI',
        name: 'Dai Stablecoin'
      }
    }
  },
  {
    chainId: NETWORK.optimism_sepolia,
    address: '0xA18D434e584B24b364B506Cf2B5cc0cEF6bE5d5c',
    name: 'Prize USDC',
    decimals: 6,
    symbol: 'pUSDC',
    logoURI: 'https://etherscan.io/token/images/centre-usdc_28.png',
    extensions: {
      underlyingAsset: {
        address: '0x22572B83c1618207788dbeab6a121662D2732226',
        symbol: 'USDC',
        name: 'USD Coin'
      }
    }
  },
  {
    chainId: NETWORK.optimism_sepolia,
    address: '0x4885D0BEfF59dA38aa8F3d9CC87d18166EBABeCF',
    name: 'Prize GUSD',
    decimals: 2,
    symbol: 'pGUSD',
    logoURI:
      'https://assets.coingecko.com/coins/images/5992/small/gemini-dollar-gusd.png?1536745278',
    extensions: {
      underlyingAsset: {
        address: '0x47233238c2fdB781DCD9e6730c6ca141446207a9',
        symbol: 'GUSD',
        name: 'Gemini Dollar'
      }
    }
  },
  {
    chainId: NETWORK.optimism_sepolia,
    address: '0x21249545298bEfD0064E8e9420b4f8FD8ECB5B6a',
    name: 'Prize WBTC',
    decimals: 8,
    symbol: 'pWBTC',
    logoURI: 'https://etherscan.io/token/images/wbtc_28.png?v=1',
    extensions: {
      underlyingAsset: {
        address: '0x221A6Ad60e30C08ae54A993F32c7671AB0cD911b',
        symbol: 'WBTC',
        name: 'Wrapped Bitcoin'
      }
    }
  },
  {
    chainId: NETWORK.optimism_sepolia,
    address: '0x75CA27Bb45d689c18f350592e036EE4E10a68D06',
    name: 'Prize WETH',
    decimals: 18,
    symbol: 'pWETH',
    logoURI: 'https://etherscan.io/token/images/weth_28.png',
    extensions: {
      underlyingAsset: {
        address: '0x3749e4DA7558BeD9b0819dE7f8C7eFc271Db004e',
        symbol: 'WETH',
        name: 'Wrapped Ether'
      }
    }
  }
]
