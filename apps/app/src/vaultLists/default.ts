import { VaultList } from '@pooltogether/hyperstructure-client-js'

const defaultVaultList: VaultList = {
  name: 'PoolTogether Testnet Vault List',
  keywords: ['pooltogether'],
  version: {
    major: 1,
    minor: 8,
    patch: 0
  },
  timestamp: '2023-06-27T16:30:47.915Z',
  logoURI: '/pooltogether-token-logo.svg',
  tokens: [
    {
      chainId: 11155111,
      address: '0x06B36307e4dA41F0C42efb7d7AbC02Df0c8b5c49',
      name: 'DAI Low Yield Vault',
      decimals: 18,
      symbol: 'PTDAILYT',
      logoURI: 'https://assets.coingecko.com/coins/images/9956/small/4943.png?1636636734',
      extensions: {
        underlyingAsset: {
          address: '0xB20Ff9fe4065CC1494dFa3A273A527A05871074F',
          symbol: 'DAI',
          name: 'Dai Stablecoin'
        }
      }
    },
    {
      chainId: 11155111,
      address: '0x041a898Bc37129d2D2232163c3374f4077255F74',
      name: 'DAI High Yield Vault',
      decimals: 18,
      symbol: 'PTDAIHYT',
      logoURI: 'https://assets.coingecko.com/coins/images/9956/small/4943.png?1636636734',
      extensions: {
        underlyingAsset: {
          address: '0xB20Ff9fe4065CC1494dFa3A273A527A05871074F',
          symbol: 'DAI',
          name: 'Dai Stablecoin'
        }
      }
    },
    {
      chainId: 11155111,
      address: '0x0771Ba4b988c66afb02f9AdF21F6E3A14d33C24E',
      name: 'USDC Low Yield Vault',
      decimals: 6,
      symbol: 'PTUSDCLYT',
      logoURI: 'https://etherscan.io/token/images/centre-usdc_28.png',
      extensions: {
        underlyingAsset: {
          address: '0x59D6b2E784f45568a76b9627De97e06Fc237DA83',
          symbol: 'USDC',
          name: 'USD Coin'
        }
      }
    },
    {
      chainId: 11155111,
      address: '0x0Ec780bE0191f8A364FAccdE91D13BE6F96632bE',
      name: 'USDC High Yield Vault',
      decimals: 6,
      symbol: 'PTUSDCHYT',
      logoURI: 'https://etherscan.io/token/images/centre-usdc_28.png',
      extensions: {
        underlyingAsset: {
          address: '0x59D6b2E784f45568a76b9627De97e06Fc237DA83',
          symbol: 'USDC',
          name: 'USD Coin'
        }
      }
    },
    {
      chainId: 11155111,
      address: '0x8FaF98698e4fF29149a8A9D06Db20E3509F3754b',
      name: 'GUSD Yield Vault',
      decimals: 2,
      symbol: 'PTGUSDT',
      logoURI:
        'https://assets.coingecko.com/coins/images/5992/small/gemini-dollar-gusd.png?1536745278',
      extensions: {
        underlyingAsset: {
          address: '0x73b3f9fecf92b4f0Eb6a20c977cBb30964858fD7',
          symbol: 'GUSD',
          name: 'Gemini dollar'
        }
      }
    },
    {
      chainId: 11155111,
      address: '0xB9c16115DA139a0A6bF2e6d2418a7987cf6DCb83',
      name: 'WBTC Yield Vault',
      decimals: 8,
      symbol: 'PTWBTCT',
      logoURI: 'https://etherscan.io/token/images/wbtc_28.png?v=1',
      extensions: {
        underlyingAsset: {
          address: '0xf78De71CF358a92AeE3370A7a3B743bF63c257d4',
          symbol: 'WBTC',
          name: 'Wrapped BTC'
        }
      }
    },
    {
      chainId: 11155111,
      address: '0x21b8f4c7E92a37B893BE39b4Ec447459fa5031C6',
      name: 'WETH Yield Vault',
      decimals: 18,
      symbol: 'PTWETHT',
      logoURI: 'https://etherscan.io/token/images/weth_28.png',
      extensions: {
        underlyingAsset: {
          address: '0x62739A657d3bB724694b46B35795532EC9B42b47',
          symbol: 'WETH',
          name: 'Wrapped Ether'
        }
      }
    }
  ]
}

export default defaultVaultList
