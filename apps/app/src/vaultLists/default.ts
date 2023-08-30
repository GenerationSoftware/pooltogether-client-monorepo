import { VaultList } from '@shared/types'
import { LINKS } from '@shared/ui'

const defaultVaultList: VaultList = {
  name: 'PoolTogether Testnet Vault List',
  keywords: ['pooltogether', 'cabana', 'g9', 'testnet'],
  version: { major: 1, minor: 11, patch: 0 },
  timestamp: '2023-08-30T20:42:37.930Z',
  logoURI: `${LINKS.app}/pooltogether-token-logo.svg`,
  tokens: [
    {
      chainId: 420,
      address: '0x3Bd1cA87F5D5C80b97D57825151715c204444C94',
      name: 'LY Prize DAI',
      decimals: 18,
      symbol: 'PTDAILYT',
      logoURI: 'https://assets.coingecko.com/coins/images/9956/small/4943.png?1636636734',
      extensions: {
        underlyingAsset: {
          address: '0x219b8d677eF97a1843FFD76E458dc1C6Ec5D13d0',
          symbol: 'DAI',
          name: 'Dai Stablecoin'
        }
      }
    },
    {
      chainId: 420,
      address: '0x1430D10F71a7c328cf28aeDf66B33C511B2Aa37B',
      name: 'HY Prize DAI',
      decimals: 18,
      symbol: 'PTDAIHYT',
      logoURI: 'https://assets.coingecko.com/coins/images/9956/small/4943.png?1636636734',
      extensions: {
        underlyingAsset: {
          address: '0x219b8d677eF97a1843FFD76E458dc1C6Ec5D13d0',
          symbol: 'DAI',
          name: 'Dai Stablecoin'
        }
      }
    },
    {
      chainId: 420,
      address: '0xfeF4a3FE03A480b1872fF0E95A30F0FA16DB323d',
      name: 'LY Prize USDC',
      decimals: 6,
      symbol: 'PTUSDCLYT',
      logoURI: 'https://etherscan.io/token/images/centre-usdc_28.png',
      extensions: {
        underlyingAsset: {
          address: '0x2c75541abD0e0025cA13D0DD5Ee5C9A697Dd3802',
          symbol: 'USDC',
          name: 'USD Coin'
        }
      }
    },
    {
      chainId: 420,
      address: '0xA1860843Be50A4795f2b10E2ADBA0b8e7C602041',
      name: 'HY Prize USDC',
      decimals: 6,
      symbol: 'PTUSDCHYT',
      logoURI: 'https://etherscan.io/token/images/centre-usdc_28.png',
      extensions: {
        underlyingAsset: {
          address: '0x2c75541abD0e0025cA13D0DD5Ee5C9A697Dd3802',
          symbol: 'USDC',
          name: 'USD Coin'
        }
      }
    },
    {
      chainId: 420,
      address: '0x3924C08a2dE571CB9713b1747B93eAc0c879De6b',
      name: 'Prize GUSD',
      decimals: 2,
      symbol: 'PTGUSDT',
      logoURI:
        'https://assets.coingecko.com/coins/images/5992/small/gemini-dollar-gusd.png?1536745278',
      extensions: {
        underlyingAsset: {
          address: '0xB654cd9f5289873BA3c732e020Df5209575E98A8',
          symbol: 'GUSD',
          name: 'Gemini dollar'
        }
      }
    },
    {
      chainId: 420,
      address: '0x98F95139A4e776e25b9C5a666A50c2462aCD32E8',
      name: 'Prize WBTC',
      decimals: 8,
      symbol: 'PTWBTCT',
      logoURI: 'https://etherscan.io/token/images/wbtc_28.png?v=1',
      extensions: {
        underlyingAsset: {
          address: '0x5BCCf4258204C5F18af7D50827a7a0A8ac65Ea6A',
          symbol: 'WBTC',
          name: 'Wrapped BTC'
        }
      }
    },
    {
      chainId: 420,
      address: '0x11166D448C2A531Ab9F61962D65760582B7f0158',
      name: 'Prize WETH',
      decimals: 18,
      symbol: 'PTWETHT',
      logoURI: 'https://etherscan.io/token/images/weth_28.png',
      extensions: {
        underlyingAsset: {
          address: '0xDb00B687687fddf95b15f17b5f1773B8337ed6f5',
          symbol: 'WETH',
          name: 'Wrapped Ether'
        }
      }
    }
  ]
}

export default defaultVaultList
