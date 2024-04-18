import { VaultList } from '@shared/types'
import { DOMAINS, NETWORK } from '@shared/utilities'
import { testnetVaults } from './testnet'

const defaultVaultList: VaultList = {
  name: 'Cabana Vault List',
  keywords: ['pooltogether', 'cabana', 'g9', 'optimism'],
  version: { major: 2, minor: 1, patch: 0 },
  timestamp: '2024-04-18T01:31:10Z',
  logoURI: `${DOMAINS.app}/pooltogether-token-logo.svg`,
  tokens: [
    {
      chainId: NETWORK.optimism,
      address: '0xa52e38a9147f5eA9E0c5547376c21c9E3F3e5e1f',
      name: 'Prize POOL',
      decimals: 18,
      symbol: 'przPOOL',
      logoURI: `${DOMAINS.app}/icons/przPOOL.svg`,
      extensions: {
        underlyingAsset: {
          address: '0x395Ae52bB17aef68C2888d941736A71dC6d4e125',
          symbol: 'POOL',
          name: 'PoolTogether'
        }
      }
    },
    {
      chainId: NETWORK.optimism,
      address: '0x03D3CE84279cB6F54f5e6074ff0F8319d830dafe',
      name: 'Prize USDC',
      decimals: 6,
      symbol: 'przUSDC',
      logoURI: `${DOMAINS.app}/icons/przUSDC.svg`,
      tags: ['aave'],
      yieldSourceURI:
        'https://app.aave.com/reserve-overview/?underlyingAsset=0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85&marketName=proto_optimism_v3',
      extensions: {
        underlyingAsset: {
          address: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
          symbol: 'USDC',
          name: 'USD Coin'
        }
      }
    },
    {
      chainId: NETWORK.optimism,
      address: '0x2998c1685E308661123F64B333767266035f5020',
      name: 'Prize WETH',
      decimals: 18,
      symbol: 'przWETH',
      logoURI: `${DOMAINS.app}/icons/przWETH.svg`,
      tags: ['aave'],
      yieldSourceURI:
        'https://app.aave.com/reserve-overview/?underlyingAsset=0x4200000000000000000000000000000000000006&marketName=proto_optimism_v3',
      extensions: {
        underlyingAsset: {
          address: '0x4200000000000000000000000000000000000006',
          symbol: 'WETH',
          name: 'Wrapped Ether'
        }
      }
    },
    {
      chainId: NETWORK.optimism,
      address: '0x3e8DBe51DA479f7E8aC46307af99AD5B4B5b41Dc',
      name: 'Prize DAI',
      decimals: 18,
      symbol: 'przDAI',
      logoURI: `${DOMAINS.app}/icons/przDAI.svg`,
      tags: ['aave'],
      yieldSourceURI:
        'https://app.aave.com/reserve-overview/?underlyingAsset=0xda10009cbd5d07dd0cecc66161fc93d7c9000da1&marketName=proto_optimism_v3',
      extensions: {
        underlyingAsset: {
          address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
          symbol: 'DAI',
          name: 'Dai Stablecoin'
        }
      }
    },
    {
      chainId: NETWORK.optimism,
      address: '0x1F16D3CCF568e96019cEdc8a2c79d2ca6257894E',
      name: 'Prize LUSD',
      decimals: 18,
      symbol: 'przLUSD',
      logoURI: `${DOMAINS.app}/icons/przLUSD.svg`,
      tags: ['aave'],
      yieldSourceURI:
        'https://app.aave.com/reserve-overview/?underlyingAsset=0xc40f949f8a4e094d1b49a23ea9241d289b7b2819&marketName=proto_optimism_v3',
      extensions: {
        underlyingAsset: {
          address: '0xc40F949F8a4e094D1b49a23ea9241D289B7b2819',
          symbol: 'LUSD',
          name: 'LUSD Stablecoin'
        }
      }
    },
    ...testnetVaults
  ]
}

export default defaultVaultList
