import { VaultList } from '@shared/types'
import { LINKS } from '@shared/ui'

const defaultVaultList: VaultList = {
  name: 'PoolTogether Testnet Vault List',
  keywords: ['pooltogether', 'cabana', 'g9', 'testnet'],
  version: { major: 1, minor: 10, patch: 0 },
  timestamp: '2023-08-23T21:03:19.574Z',
  logoURI: `${LINKS.app}/pooltogether-token-logo.svg`,
  tokens: [
    {
      chainId: 420,
      address: '0x0BFE04201c496A9994B920DEb6087A60bDAdFbBB',
      name: 'LY Prize DAI',
      decimals: 18,
      symbol: 'PTDAILYT',
      logoURI: 'https://assets.coingecko.com/coins/images/9956/small/4943.png?1636636734',
      extensions: {
        underlyingAsset: {
          address: '0xce0B8850408caC7145E11A793f98e22aE39391E2',
          symbol: 'DAI',
          name: 'Dai Stablecoin'
        }
      }
    },
    {
      chainId: 420,
      address: '0xfFB08a9ffC360806Be7EF8cf815c1274eF92CEA9',
      name: 'HY Prize DAI',
      decimals: 18,
      symbol: 'PTDAIHYT',
      logoURI: 'https://assets.coingecko.com/coins/images/9956/small/4943.png?1636636734',
      extensions: {
        underlyingAsset: {
          address: '0xce0B8850408caC7145E11A793f98e22aE39391E2',
          symbol: 'DAI',
          name: 'Dai Stablecoin'
        }
      }
    },
    {
      chainId: 420,
      address: '0x9e11c3D53A68c07F6D839e5D89a94052753ceDCb',
      name: 'LY Prize USDC',
      decimals: 6,
      symbol: 'PTUSDCLYT',
      logoURI: 'https://etherscan.io/token/images/centre-usdc_28.png',
      extensions: {
        underlyingAsset: {
          address: '0xa29377053623B8852306Af711Ecf6C7b855512e8',
          symbol: 'USDC',
          name: 'USD Coin'
        }
      }
    },
    {
      chainId: 420,
      address: '0x0410CaE69dD01f58224d54881648E35c6CB874FA',
      name: 'HY Prize USDC',
      decimals: 6,
      symbol: 'PTUSDCHYT',
      logoURI: 'https://etherscan.io/token/images/centre-usdc_28.png',
      extensions: {
        underlyingAsset: {
          address: '0xa29377053623B8852306Af711Ecf6C7b855512e8',
          symbol: 'USDC',
          name: 'USD Coin'
        }
      }
    },
    {
      chainId: 420,
      address: '0x4b7a2e1a70eA05523542C9189FA51b133884f321',
      name: 'Prize GUSD',
      decimals: 2,
      symbol: 'PTGUSDT',
      logoURI:
        'https://assets.coingecko.com/coins/images/5992/small/gemini-dollar-gusd.png?1536745278',
      extensions: {
        underlyingAsset: {
          address: '0x993DA7F244535B1F6f48BE745889649a8Ba21904',
          symbol: 'GUSD',
          name: 'Gemini dollar'
        }
      }
    },
    {
      chainId: 420,
      address: '0xB9A647d3391b939cB49b44D3c5e93C63D96aD4a4',
      name: 'Prize WBTC',
      decimals: 8,
      symbol: 'PTWBTCT',
      logoURI: 'https://etherscan.io/token/images/wbtc_28.png?v=1',
      extensions: {
        underlyingAsset: {
          address: '0x3C8f76D0a36B8eCeac04e7cEe1FF62B55F6B1FA6',
          symbol: 'WBTC',
          name: 'Wrapped BTC'
        }
      }
    },
    {
      chainId: 420,
      address: '0xE2ef926250b0E8a07578D76d9f57E5092340a6Fa',
      name: 'Prize WETH',
      decimals: 18,
      symbol: 'PTWETHT',
      logoURI: 'https://etherscan.io/token/images/weth_28.png',
      extensions: {
        underlyingAsset: {
          address: '0x30F00f959897d80ae98fcb5fD513c9668884F231',
          symbol: 'WETH',
          name: 'Wrapped Ether'
        }
      }
    }
  ]
}

export default defaultVaultList
