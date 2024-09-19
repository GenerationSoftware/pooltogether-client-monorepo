import { VaultList } from '@shared/types'
import { DOMAINS, NETWORK } from '@shared/utilities'

export const mainnetVaults: VaultList['tokens'] = [
  {
    chainId: NETWORK.mainnet,
    address: '0x9eE31E845fF1358Bf6B1F914d3918c6223c75573',
    name: 'Prize POOL',
    decimals: 18,
    symbol: 'przPOOL',
    logoURI: `${DOMAINS.app}/icons/przPOOL.svg`,
    extensions: {
      underlyingAsset: {
        address: '0x0cEC1A9154Ff802e7934Fc916Ed7Ca50bDE6844e',
        symbol: 'POOL',
        name: 'PoolTogether'
      },
      yieldSource: {
        name: 'PoolTogether'
      }
    }
  },
  {
    chainId: NETWORK.mainnet,
    address: '0x96fE7B5762bD4405149a9A313473e68a8E870F6C',
    name: 'Prize USDC',
    decimals: 6,
    symbol: 'przUSDC',
    logoURI: `${DOMAINS.app}/icons/przUSDC.svg`,
    tags: ['aave'],
    extensions: {
      underlyingAsset: {
        address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        symbol: 'USDC',
        name: 'USD Coin'
      },
      yieldSource: {
        name: 'Aave',
        appURI:
          'https://app.aave.com/reserve-overview/?underlyingAsset=0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48&marketName=proto_mainnet_v3'
      }
    }
  },
  {
    chainId: NETWORK.mainnet,
    address: '0x3acd377dA549010a197b9Ed0F271e1f621e4b62e',
    name: 'Prize WETH',
    decimals: 18,
    symbol: 'przWETH',
    logoURI: `${DOMAINS.app}/icons/przWETH.svg`,
    tags: ['aave', 'lido'],
    extensions: {
      underlyingAsset: {
        address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        symbol: 'WETH',
        name: 'Wrapped Ether'
      },
      yieldSource: {
        name: 'Aave',
        appURI:
          'https://app.aave.com/reserve-overview/?underlyingAsset=0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2&marketName=proto_lido_v3'
      }
    }
  },
  {
    chainId: NETWORK.mainnet,
    address: '0x8aB157b779C72e2348364b5F8148cC45f63a8724',
    name: 'Prize USDS',
    decimals: 18,
    symbol: 'przUSDS',
    tags: ['dsr'],
    extensions: {
      underlyingAsset: {
        address: '0xdC035D45d973E3EC169d2276DDab16f1e407384F',
        symbol: 'USDS',
        name: 'USDS Stablecoin'
      },
      yieldSource: {
        name: 'Sky',
        appURI: 'https://app.sky.money/'
      }
    }
  }
]
