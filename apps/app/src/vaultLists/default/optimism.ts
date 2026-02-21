import { VaultList } from '@shared/types'
import { DOMAINS, NETWORK } from '@shared/utilities'

export const optimismVaults: VaultList['tokens'] = [
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
      },
      yieldSource: {
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
    extensions: {
      underlyingAsset: {
        address: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
        symbol: 'USDC',
        name: 'USD Coin'
      },
      yieldSource: {
        name: 'Aave',
        appURI:
          'https://app.aave.com/reserve-overview/?underlyingAsset=0x0b2c639c533813f4aa9d7837caf62653d097ff85&marketName=proto_optimism_v3'
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
    extensions: {
      underlyingAsset: {
        address: '0x4200000000000000000000000000000000000006',
        symbol: 'WETH',
        name: 'Wrapped Ether'
      },
      yieldSource: {
        name: 'Aave',
        appURI:
          'https://app.aave.com/reserve-overview/?underlyingAsset=0x4200000000000000000000000000000000000006&marketName=proto_optimism_v3'
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
    extensions: {
      underlyingAsset: {
        address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
        symbol: 'DAI',
        name: 'Dai Stablecoin'
      },
      yieldSource: {
        name: 'Aave',
        appURI:
          'https://app.aave.com/reserve-overview/?underlyingAsset=0xda10009cbd5d07dd0cecc66161fc93d7c9000da1&marketName=proto_optimism_v3'
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
    extensions: {
      underlyingAsset: {
        address: '0xc40F949F8a4e094D1b49a23ea9241D289B7b2819',
        symbol: 'LUSD',
        name: 'LUSD Stablecoin'
      },
      yieldSource: {
        name: 'Aave',
        appURI:
          'https://app.aave.com/reserve-overview/?underlyingAsset=0xc40f949f8a4e094d1b49a23ea9241d289b7b2819&marketName=proto_optimism_v3'
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
    extensions: {
      underlyingAsset: {
        address: '0xDB1FE6DA83698885104DA02A6e0b3b65c0B0dE80',
        symbol: 'vAMMV2-POOL/WETH',
        name: 'VolatileV2 AMM - POOL/WETH'
      },
      yieldSource: {
        name: 'Beefy',
        appURI: 'https://app.beefy.com/vault/velodrome-v2-pool-weth'
      },
      lp: {
        appURI:
          'https://velodrome.finance/deposit?token0=0x395Ae52bB17aef68C2888d941736A71dC6d4e125&token1=0x4200000000000000000000000000000000000006&type=-1&factory=0xF1046053aa5682b4F9a81b5481394DA16BE5FF5a&chain=10'
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
    tags: ['beefy', 'lp', 'velodrome', 'deprecated'],
    extensions: {
      underlyingAsset: {
        address: '0x6dA98Bde0068d10DDD11b468b197eA97D96F96Bc',
        symbol: 'vAMMV2-wstETH/WETH',
        name: 'VolatileV2 AMM - wstETH/WETH'
      },
      yieldSource: {
        name: 'Beefy',
        appURI: 'https://app.beefy.com/vault/velodrome-v2-wsteth-weth'
      },
      lp: {
        appURI:
          'https://velodrome.finance/deposit?token0=0x1F32b1c2345538c0c6f582fCB022739c4A194Ebb&token1=0x4200000000000000000000000000000000000006&type=-1&factory=0xF1046053aa5682b4F9a81b5481394DA16BE5FF5a&chain=10'
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
    extensions: {
      underlyingAsset: {
        address: '0x4200000000000000000000000000000000000042',
        symbol: 'OP',
        name: 'Optimism'
      },
      yieldSource: {
        name: 'Beefy',
        appURI: 'https://app.beefy.com/vault/sonne-op-op'
      }
    }
  },
  {
    chainId: NETWORK.optimism,
    address: '0x5eb32e6dEc24d58C14D21fd1b329d9f65DE58364',
    name: 'Prize WETH/mooBIFI',
    decimals: 18,
    symbol: 'przWETH/mooBIFI',
    logoURI: `${DOMAINS.app}/icons/przVELO.svg`,
    tags: ['beefy', 'lp', 'velodrome', 'deprecated'],
    extensions: {
      underlyingAsset: {
        address: '0x6Ed6Df1C23C51cb7Cc67a348cC8d9E6108EA3BFE',
        symbol: 'vAMMV2-WETH/mooBIFI',
        name: 'VolatileV2 AMM - WETH/mooBIFI'
      },
      yieldSource: {
        name: 'Beefy',
        appURI: 'https://app.beefy.com/vault/velodrome-v2-weth-moobifi'
      },
      lp: {
        appURI:
          'https://velodrome.finance/deposit?token0=0x4200000000000000000000000000000000000006&token1=0xc55E93C62874D8100dBd2DfE307EDc1036ad5434&type=-1&factory=0xF1046053aa5682b4F9a81b5481394DA16BE5FF5a&chain=10'
      }
    }
  },
  {
    chainId: NETWORK.optimism,
    address: '0x8c2f27b7819eb1bb7e3b5c407c5e1839186d5aba',
    name: 'Prize wrETH',
    decimals: 18,
    symbol: 'przWRETH',
    logoURI: `${DOMAINS.app}/icons/przWRETH.svg`,
    tags: ['rocketpool', 'deprecated'],
    extensions: {
      underlyingAsset: {
        address: '0x67CdE7AF920682A29fcfea1A179ef0f30F48Df3e',
        symbol: 'wrETH',
        name: 'Wrapped Rocket Pool ETH'
      },
      yieldSource: {
        name: 'Rocket Pool',
        appURI: 'https://rocketpool.net'
      }
    }
  },
  {
    chainId: NETWORK.optimism,
    address: '0x7889366a039d92dd6aa12ce8f6fb027c3b7e397c',
    name: 'Prize USDC/OP',
    decimals: 18,
    symbol: 'przUSDC/OP',
    logoURI: `${DOMAINS.app}/icons/przVELO.svg`,
    tags: ['beefy', 'lp', 'velodrome', 'deprecated'],
    extensions: {
      underlyingAsset: {
        address: '0x67F56Ac099F11aD5F65E2ec804f75F2cEa6ab8C5',
        symbol: 'vAMMV2-USDC/OP',
        name: 'VolatileV2 AMM - USDC/OP'
      },
      yieldSource: {
        name: 'Beefy',
        appURI: 'https://app.beefy.com/vault/velodrome-v2-usdc-op'
      },
      lp: {
        appURI:
          'https://velodrome.finance/deposit?token0=0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85&token1=0x4200000000000000000000000000000000000042&type=-1&factory=0xF1046053aa5682b4F9a81b5481394DA16BE5FF5a&chain=10'
      }
    }
  },
  {
    chainId: NETWORK.optimism,
    address: '0xE2778B7c04a44dC8480FeE88edc3cEF8ee11Fce0',
    name: 'Prize WETH/tBTC',
    decimals: 18,
    symbol: 'przWETH/tBTC',
    logoURI: `${DOMAINS.app}/icons/przVELO.svg`,
    tags: ['beefy', 'lp', 'velodrome', 'deprecated'],
    extensions: {
      underlyingAsset: {
        address: '0xadBB23Bcc3C1B9810491897cb0690Cf645B858b1',
        symbol: 'vAMMV2-WETH/tBTC',
        name: 'VolatileV2 AMM - WETH/tBTC'
      },
      yieldSource: {
        name: 'Beefy',
        appURI: 'https://app.beefy.com/vault/velodrome-v2-weth-tbtc'
      },
      lp: {
        appURI:
          'https://velodrome.finance/deposit?token0=0x4200000000000000000000000000000000000006&token1=0x6c84a8f1c29108F47a79964b5Fe888D4f4D0dE40&type=-1&factory=0xF1046053aa5682b4F9a81b5481394DA16BE5FF5a&chain=10'
      }
    }
  },
  {
    chainId: NETWORK.optimism,
    address: '0x626f8282f712732be0c12d4a89a86be6e9ce8ac8',
    name: 'Prize USDC/VELO',
    decimals: 18,
    symbol: 'przUSDC/VELO',
    logoURI: `${DOMAINS.app}/icons/przVELO.svg`,
    tags: ['beefy', 'lp', 'velodrome', 'deprecated'],
    extensions: {
      underlyingAsset: {
        address: '0xa0A215dE234276CAc1b844fD58901351a50fec8A',
        symbol: 'vAMMV2-USDC/VELO',
        name: 'VolatileV2 AMM - USDC/VELO'
      },
      yieldSource: {
        name: 'Beefy',
        appURI: 'https://app.beefy.com/vault/velodrome-v2-velo-usdc'
      },
      lp: {
        appURI:
          'https://velodrome.finance/deposit?token0=0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85&token1=0x9560e827aF36c94D2Ac33a39bCE1Fe78631088Db&type=-1&factory=0xF1046053aa5682b4F9a81b5481394DA16BE5FF5a&chain=10'
      }
    }
  },
  {
    chainId: NETWORK.optimism,
    address: '0xb4063d1f0b0b7caee88708895ec4e365bf44b984',
    name: 'Prize USDC/SNX',
    decimals: 18,
    symbol: 'przUSDC/SNX',
    logoURI: `${DOMAINS.app}/icons/przVELO.svg`,
    tags: ['beefy', 'lp', 'velodrome', 'deprecated'],
    extensions: {
      underlyingAsset: {
        address: '0x894d6Ea97767EbeCEfE01c9410f6Bd67935AA952',
        symbol: 'vAMMV2-USDC/SNX',
        name: 'VolatileV2 AMM - USDC/SNX'
      },
      yieldSource: {
        name: 'Beefy',
        appURI: 'https://app.beefy.com/vault/velodrome-v2-usdc-snx-2'
      },
      lp: {
        appURI:
          'https://velodrome.finance/deposit?token0=0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85&token1=0x8700dAec35aF8Ff88c16BdF0418774CB3D7599B4&type=-1&factory=0xF1046053aa5682b4F9a81b5481394DA16BE5FF5a&chain=10'
      }
    }
  },
  {
    chainId: NETWORK.optimism,
    address: '0xB4911EFd3d53352f658536aFD37e7897cB7dD7f6',
    name: 'Prize tBTC/WBTC',
    decimals: 18,
    symbol: 'przTBTC/WBTC',
    logoURI: `${DOMAINS.app}/icons/przCRV.svg`,
    tags: ['beefy', 'lp', 'curve', 'deprecated'],
    extensions: {
      underlyingAsset: {
        address: '0x1Dc5c0f8668a9F54ED922171d578011850ca0341',
        symbol: '2BTC-f',
        name: 'Curve.fi Factory Plain Pool: 2BTC'
      },
      yieldSource: {
        name: 'Beefy',
        appURI: 'https://app.beefy.com/vault/curve-op-tbtc'
      },
      lp: {
        appURI: 'https://curve.fi/#/optimism/pools/factory-v2-63'
      }
    }
  },
  {
    chainId: NETWORK.optimism,
    address: '0x11271bF9855B679Bc484a0C80a69D8cc72fcEf89',
    name: 'USDC WinETH',
    decimals: 6,
    symbol: 'USDCwinETH',
    logoURI: `${DOMAINS.app}/icons/przUSDC.svg`,
    tags: ['aave', 'charity'],
    extensions: {
      underlyingAsset: {
        address: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
        symbol: 'USDC',
        name: 'USD Coin'
      },
      yieldSource: {
        name: 'Aave',
        appURI:
          'https://app.aave.com/reserve-overview/?underlyingAsset=0x0b2c639c533813f4aa9d7837caf62653d097ff85&marketName=proto_optimism_v3'
      }
    }
  },
  {
    chainId: NETWORK.optimism,
    address: '0xdAaF4b68B1299Fb9b05AE578cb3D06C8528138D4',
    name: 'Prize wstETH',
    decimals: 18,
    symbol: 'przWSTETH',
    logoURI: `${DOMAINS.app}/icons/przSTETH.svg`,
    tags: ['moonwell', 'deprecated'],
    extensions: {
      underlyingAsset: {
        address: '0x1F32b1c2345538c0c6f582fCB022739c4A194Ebb',
        symbol: 'wstETH',
        name: 'Wrapped liquid staked Ether 2.0'
      },
      yieldSource: {
        name: 'Moonwell',
        appURI: 'https://moonwell.fi/markets/supply/optimism/wsteth'
      }
    }
  },
  {
    chainId: NETWORK.optimism,
    address: '0x449b6A60501015C1a8fda6CD97147280F5eb33D7',
    name: 'Prize OP',
    decimals: 18,
    symbol: 'przOP',
    logoURI: `${DOMAINS.app}/icons/przOP.svg`,
    tags: ['moonwell'],
    extensions: {
      underlyingAsset: {
        address: '0x4200000000000000000000000000000000000042',
        symbol: 'OP',
        name: 'Optimism'
      },
      yieldSource: {
        name: 'Moonwell',
        appURI: 'https://moonwell.fi/markets/supply/optimism/op'
      }
    }
  }
]
