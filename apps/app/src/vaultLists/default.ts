import { VaultList } from '@shared/types'
import { DOMAINS, NETWORK } from '@shared/utilities'
import { testnetVaults } from './testnet'

const defaultVaultList: VaultList = {
  name: 'Cabana Vault List',
  keywords: ['pooltogether', 'cabana', 'g9', 'optimism'],
  version: { major: 2, minor: 6, patch: 1 },
  timestamp: '2024-05-27T16:06:00Z',
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
    {
      chainId: NETWORK.optimism,
      address: '0x9b53ef6f13077727d22cb4acad1119c79a97be17',
      name: 'Prize POOL/WETH',
      decimals: 18,
      symbol: 'przPOOLWETH',
      logoURI: `${DOMAINS.app}/icons/przVELO.svg`,
      tags: ['beefy', 'lp', 'velodrome'],
      yieldSourceURI: 'https://app.beefy.finance/vault/velodrome-v2-pool-weth',
      extensions: {
        underlyingAsset: {
          address: '0xDB1FE6DA83698885104DA02A6e0b3b65c0B0dE80',
          symbol: 'vAMMV2-POOL/WETH',
          name: 'VolatileV2 AMM - POOL/WETH'
        },
        lp: {
          appURI:
            'https://velodrome.finance/deposit?token0=0x395Ae52bB17aef68C2888d941736A71dC6d4e125&token1=0x4200000000000000000000000000000000000006&type=-1'
        }
      }
    },
    {
      chainId: NETWORK.optimism,
      address: '0x9b4c0de59628c64b02d7ce86f21db9a579539d5a',
      name: 'Prize WSTETH/ETH',
      decimals: 18,
      symbol: 'przWSTETH-ETH',
      logoURI: `${DOMAINS.app}/icons/przVELO.svg`,
      tags: ['beefy', 'lp', 'velodrome'],
      yieldSourceURI: 'https://app.beefy.finance/vault/velodrome-v2-wsteth-weth',
      extensions: {
        underlyingAsset: {
          address: '0x6dA98Bde0068d10DDD11b468b197eA97D96F96Bc',
          symbol: 'vAMMV2-wstETH/WETH',
          name: 'VolatileV2 AMM - wstETH/WETH'
        },
        lp: {
          appURI:
            'https://velodrome.finance/deposit?token0=0x1F32b1c2345538c0c6f582fCB022739c4A194Ebb&token1=0x4200000000000000000000000000000000000006&type=-1'
        }
      }
    },
    {
      chainId: NETWORK.optimism,
      address: '0xF1d934D5A3c6E530ac1450c92Af5Ba01eb90d4dE',
      name: 'Prize OP',
      decimals: 18,
      symbol: 'przOP',
      logoURI: `${DOMAINS.app}/icons/przOP.svg`,
      tags: ['beefy', 'sonne', 'deprecated'],
      yieldSourceURI: 'https://app.beefy.finance/vault/sonne-op-op',
      extensions: {
        underlyingAsset: {
          address: '0x4200000000000000000000000000000000000042',
          symbol: 'OP',
          name: 'Optimism'
        }
      }
    },
    {
      chainId: NETWORK.base,
      address: '0x6B5a5c55E9dD4bb502Ce25bBfbaA49b69cf7E4dd',
      name: 'Prize POOL',
      decimals: 18,
      symbol: 'przPOOL',
      logoURI: `${DOMAINS.app}/icons/przPOOL.svg`,
      extensions: {
        underlyingAsset: {
          address: '0xd652C5425aea2Afd5fb142e120FeCf79e18fafc3',
          symbol: 'POOL',
          name: 'PoolTogether'
        }
      }
    },
    {
      chainId: NETWORK.base,
      address: '0x7f5C2b379b88499aC2B997Db583f8079503f25b9',
      name: 'Prize USDC',
      decimals: 6,
      symbol: 'przUSDC',
      logoURI: `${DOMAINS.app}/icons/przUSDC.svg`,
      tags: ['moonwell'],
      yieldSourceURI: 'https://moonwell.fi/markets/supply/base/usdc',
      extensions: {
        underlyingAsset: {
          address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
          symbol: 'USDC',
          name: 'USD Coin'
        }
      }
    },
    {
      chainId: NETWORK.base,
      address: '0x8d1322CaBe5Ef2949f6bf4941Cc7765187C1091A',
      name: 'Prize AERO',
      decimals: 18,
      symbol: 'przAERO',
      logoURI: `${DOMAINS.app}/icons/przAERO.svg`,
      tags: ['moonwell'],
      yieldSourceURI: 'https://moonwell.fi/markets/supply/base/aero',
      extensions: {
        underlyingAsset: {
          address: '0x940181a94A35A4569E4529A3CDfB74e38FD98631',
          symbol: 'AERO',
          name: 'Aerodrome'
        }
      }
    },
    {
      chainId: NETWORK.base,
      address: '0x5b623C127254C6fec04b492ecDF4b11c45FBB9D5',
      name: 'Prize cbETH',
      decimals: 18,
      symbol: 'przCBETH',
      logoURI: `${DOMAINS.app}/icons/przCBETH.svg`,
      tags: ['moonwell'],
      yieldSourceURI: 'https://moonwell.fi/markets/supply/base/cbeth',
      extensions: {
        underlyingAsset: {
          address: '0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22',
          symbol: 'cbETH',
          name: 'Coinbase Wrapped Staked ETH'
        }
      }
    },
    {
      chainId: NETWORK.base,
      address: '0x75D700F4C21528A2bb603b6Ed899ACFdE5c4B086',
      name: 'Prize wstETH',
      decimals: 18,
      symbol: 'przWSTETH',
      logoURI: `${DOMAINS.app}/icons/przSTETH.svg`,
      tags: ['moonwell'],
      yieldSourceURI: 'https://moonwell.fi/markets/supply/base/wsteth',
      extensions: {
        underlyingAsset: {
          address: '0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452',
          symbol: 'wstETH',
          name: 'Wrapped Staked Ether'
        }
      }
    },
    ...testnetVaults
  ]
}

export default defaultVaultList
