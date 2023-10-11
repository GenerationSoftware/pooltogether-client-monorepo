import { VaultList } from '@shared/types'
import { LINKS } from '@shared/ui'

const defaultVaultList: VaultList = {
  name: 'PoolTogether Vault List',
  keywords: ['pooltogether', 'cabana', 'g9', 'optimism'],
  version: { major: 1, minor: 13, patch: 0 },
  timestamp: '2023-10-11T00:09:00.301Z',
  logoURI: `${LINKS.app}/pooltogether-token-logo.svg`,
  tokens: [
    // {
    //   chainId: 10,
    //   address: '0x31515cfC4550d9C83E2d86E8a352886d1364E2D9',
    //   name: 'Prize USDC',
    //   decimals: 6,
    //   symbol: 'PTUSDC',
    //   logoURI: 'https://etherscan.io/token/images/centre-usdc_28.png',
    //   yieldSourceURI:
    //     'https://app.aave.com/reserve-overview/?underlyingAsset=0x7f5c764cbc14f9669b88837ca1490cca17c31607&marketName=proto_optimism_v3',
    //   extensions: {
    //     underlyingAsset: {
    //       address: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
    //       symbol: 'USDC',
    //       name: 'USD Coin'
    //     }
    //   }
    // },
    // {
    //   chainId: 10,
    //   address: '0x1732Ce5486ea47f607550Ccbe499cd0f894E0494',
    //   name: 'Prize WETH',
    //   decimals: 18,
    //   symbol: 'PTWETH',
    //   logoURI: 'https://etherscan.io/token/images/weth_28.png',
    //   yieldSourceURI:
    //     'https://app.aave.com/reserve-overview/?underlyingAsset=0x4200000000000000000000000000000000000006&marketName=proto_optimism_v3',
    //   extensions: {
    //     underlyingAsset: {
    //       address: '0x4200000000000000000000000000000000000006',
    //       symbol: 'WETH',
    //       name: 'Wrapped Ether'
    //     }
    //   }
    // },
    {
      chainId: 420,
      address: '0x21925199568C8bd5623622FF31d719749f920A8D',
      name: 'Prize DAI - LY',
      decimals: 18,
      symbol: 'PDAI-LY',
      logoURI: 'https://assets.coingecko.com/coins/images/9956/small/4943.png?1636636734',
      extensions: {
        underlyingAsset: {
          address: '0x2b311E07bCE542A73bB4887D0f503f0b6ea70711',
          symbol: 'DAI',
          name: 'Dai Stablecoin'
        }
      }
    },
    {
      chainId: 420,
      address: '0x32C45E4596931eC5900eA4D2703E7CF961Ce2ad6',
      name: 'Prize DAI - HY',
      decimals: 18,
      symbol: 'PDAI-HY',
      logoURI: 'https://assets.coingecko.com/coins/images/9956/small/4943.png?1636636734',
      extensions: {
        underlyingAsset: {
          address: '0x2b311E07bCE542A73bB4887D0f503f0b6ea70711',
          symbol: 'DAI',
          name: 'Dai Stablecoin'
        }
      }
    },
    {
      chainId: 420,
      address: '0x61682FBA8394970CE014bcDE8ae0eC149c29757c',
      name: 'Prize USDC - LY',
      decimals: 6,
      symbol: 'PUSDC-LY',
      logoURI: 'https://etherscan.io/token/images/centre-usdc_28.png',
      extensions: {
        underlyingAsset: {
          address: '0x880027cc134A07Ddc9E5c7e7659A11ecfD828705',
          symbol: 'USDC',
          name: 'USD Coin'
        }
      }
    },
    {
      chainId: 420,
      address: '0x171df7a2D8547322de5BA27FD9856B04620A3562',
      name: 'Prize USDC - HY',
      decimals: 6,
      symbol: 'PUSDC-HY',
      logoURI: 'https://etherscan.io/token/images/centre-usdc_28.png',
      extensions: {
        underlyingAsset: {
          address: '0x880027cc134A07Ddc9E5c7e7659A11ecfD828705',
          symbol: 'USDC',
          name: 'USD Coin'
        }
      }
    },
    {
      chainId: 420,
      address: '0x0B87bF0822AFAecDEb367cfAaCcf40c0e895F3AD',
      name: 'Prize GUSD',
      decimals: 2,
      symbol: 'PGUSD',
      logoURI:
        'https://assets.coingecko.com/coins/images/5992/small/gemini-dollar-gusd.png?1536745278',
      extensions: {
        underlyingAsset: {
          address: '0x206acF3BBEC50972880e665EE7D03342A2fF9F5d',
          symbol: 'GUSD',
          name: 'Gemini dollar'
        }
      }
    },
    {
      chainId: 420,
      address: '0x7Ea2e76587962c526B60492bd8342AAe859f1219',
      name: 'Prize WBTC',
      decimals: 8,
      symbol: 'PWBTC',
      logoURI: 'https://etherscan.io/token/images/wbtc_28.png?v=1',
      extensions: {
        underlyingAsset: {
          address: '0x8778DA5Ed4B586960094d43c5a3a52da3a4aE613',
          symbol: 'WBTC',
          name: 'Wrapped BTC'
        }
      }
    },
    {
      chainId: 420,
      address: '0x7da2c9C9F3147275837Be99029A2437f8d7b54D6',
      name: 'Prize WETH',
      decimals: 18,
      symbol: 'PWETH',
      logoURI: 'https://etherscan.io/token/images/weth_28.png',
      extensions: {
        underlyingAsset: {
          address: '0xE62aC4184f04f0BA3C99DD2fe931cDc4D0489ac9',
          symbol: 'WETH',
          name: 'Wrapped Ether'
        }
      }
    }
  ]
}

export default defaultVaultList
