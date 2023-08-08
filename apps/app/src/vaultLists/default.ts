import { VaultList } from '@pooltogether/hyperstructure-client-js'
import { LINKS } from '@shared/ui'

const defaultVaultList: VaultList = {
  name: 'PoolTogether Testnet Vault List',
  keywords: ['pooltogether', 'cabana', 'g9', 'testnet'],
  version: {
    major: 1,
    minor: 9,
    patch: 0
  },
  timestamp: '2023-08-04T19:47:31.285Z',
  logoURI: `${LINKS.app}/pooltogether-token-logo.svg`,
  tokens: [
    {
      chainId: 11155111,
      address: '0xA036647Ec8C956475F8b8fE473eC49F959846FA1',
      name: 'LY Prize DAI',
      decimals: 18,
      symbol: 'PTDAILYT',
      logoURI: 'https://assets.coingecko.com/coins/images/9956/small/4943.png?1636636734',
      extensions: {
        underlyingAsset: {
          address: '0x0Aa9E2E0B37fB54c19E45CB246b17b0E700aB98d',
          symbol: 'DAI',
          name: 'Dai Stablecoin'
        }
      }
    },
    {
      chainId: 11155111,
      address: '0xC7E0df4a00f9A99012A828Dbd2A26dc8c01E624e',
      name: 'HY Prize DAI',
      decimals: 18,
      symbol: 'PTDAIHYT',
      logoURI: 'https://assets.coingecko.com/coins/images/9956/small/4943.png?1636636734',
      extensions: {
        underlyingAsset: {
          address: '0x0Aa9E2E0B37fB54c19E45CB246b17b0E700aB98d',
          symbol: 'DAI',
          name: 'Dai Stablecoin'
        }
      }
    },
    {
      chainId: 11155111,
      address: '0xb634839AC5c7DDCF8523ba7Cc2a9211F4f107423',
      name: 'LY Prize USDC',
      decimals: 6,
      symbol: 'PTUSDCLYT',
      logoURI: 'https://etherscan.io/token/images/centre-usdc_28.png',
      extensions: {
        underlyingAsset: {
          address: '0x4D5f2CD31701f3e5dE77b3F89Ee7b80EB87b4Acc',
          symbol: 'USDC',
          name: 'USD Coin'
        }
      }
    },
    {
      chainId: 11155111,
      address: '0x2682C2ff5510fF943f2ebFd0a665e3203A9bEE4e',
      name: 'HY Prize USDC',
      decimals: 6,
      symbol: 'PTUSDCHYT',
      logoURI: 'https://etherscan.io/token/images/centre-usdc_28.png',
      extensions: {
        underlyingAsset: {
          address: '0x4D5f2CD31701f3e5dE77b3F89Ee7b80EB87b4Acc',
          symbol: 'USDC',
          name: 'USD Coin'
        }
      }
    },
    {
      chainId: 11155111,
      address: '0xdC140F0193A9899982c8446c249a94Dea147C20B',
      name: 'Prize GUSD',
      decimals: 2,
      symbol: 'PTGUSDT',
      logoURI:
        'https://assets.coingecko.com/coins/images/5992/small/gemini-dollar-gusd.png?1536745278',
      extensions: {
        underlyingAsset: {
          address: '0xa99b3A8503260ab32753C382eac297aCd4a43908',
          symbol: 'GUSD',
          name: 'Gemini dollar'
        }
      }
    },
    {
      chainId: 11155111,
      address: '0xF4236B70BfC155b65A5571A5E4f8961107aBfCe6',
      name: 'Prize WBTC',
      decimals: 8,
      symbol: 'PTWBTCT',
      logoURI: 'https://etherscan.io/token/images/wbtc_28.png?v=1',
      extensions: {
        underlyingAsset: {
          address: '0x29c102109D6cb2D866CFEc380E0E10E9a287A75f',
          symbol: 'WBTC',
          name: 'Wrapped BTC'
        }
      }
    },
    {
      chainId: 11155111,
      address: '0x80f5984aD748878c9822Af1231dEEF7466Ad85Bf',
      name: 'Prize WETH',
      decimals: 18,
      symbol: 'PTWETHT',
      logoURI: 'https://etherscan.io/token/images/weth_28.png',
      extensions: {
        underlyingAsset: {
          address: '0x4457025dFF44E3d9085D9195828e7D53FE6a7088',
          symbol: 'WETH',
          name: 'Wrapped Ether'
        }
      }
    }
  ]
}

export default defaultVaultList
