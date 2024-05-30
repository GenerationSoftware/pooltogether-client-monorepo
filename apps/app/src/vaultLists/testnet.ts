import { VaultList } from '@shared/types'
import { NETWORK } from '@shared/utilities'

export const testnetVaults: VaultList['tokens'] = [
  {
    chainId: NETWORK.optimism_sepolia,
    address: '0x95849a4C2E58F4f8Bf868ADEf10B05747A24eE71',
    name: 'Prize POOL',
    decimals: 18,
    symbol: 'pPOOL',
    logoURI: 'https://etherscan.io/token/images/pooltogether_32.png',
    extensions: {
      underlyingAsset: {
        address: '0x24Ffb8Ca3DeA588B267A15F1d94766dCbA034aE6',
        symbol: 'POOL',
        name: 'PoolTogether'
      }
    }
  },
  {
    chainId: NETWORK.optimism_sepolia,
    address: '0xE039683D5f9717d6f74D252722546cFedAB32250',
    name: 'Prize DAI',
    decimals: 18,
    symbol: 'pDAI',
    logoURI: 'https://assets.coingecko.com/coins/images/9956/small/4943.png?1636636734',
    extensions: {
      underlyingAsset: {
        address: '0xeF38f21EC5477f6E3D4b7e9f0DEa44A788C669b0',
        symbol: 'DAI',
        name: 'Dai Stablecoin'
      }
    }
  },
  {
    chainId: NETWORK.optimism_sepolia,
    address: '0xCC255d71c57A5D5f92183a66b7fC5589151aDcD0',
    name: 'Prize USDC',
    decimals: 6,
    symbol: 'pUSDC',
    logoURI: 'https://etherscan.io/token/images/centre-usdc_28.png',
    extensions: {
      underlyingAsset: {
        address: '0xdED96a50515f1a4620a3C5244fAe15eD7D216d4a',
        symbol: 'USDC',
        name: 'USD Coin'
      }
    }
  },
  {
    chainId: NETWORK.optimism_sepolia,
    address: '0xE1498d24A398b588b5e3F2c5d230991304203AD9',
    name: 'Prize GUSD',
    decimals: 2,
    symbol: 'pGUSD',
    logoURI:
      'https://assets.coingecko.com/coins/images/5992/small/gemini-dollar-gusd.png?1536745278',
    extensions: {
      underlyingAsset: {
        address: '0x68F92539f64E486f2853BB2892933a21b54829E5',
        symbol: 'GUSD',
        name: 'Gemini Dollar'
      }
    }
  },
  {
    chainId: NETWORK.optimism_sepolia,
    address: '0x02dda5914b78f0751FdF5BBe2050eFABD95DfF46',
    name: 'Prize WBTC',
    decimals: 8,
    symbol: 'pWBTC',
    logoURI: 'https://etherscan.io/token/images/wbtc_28.png?v=1',
    extensions: {
      underlyingAsset: {
        address: '0x6c6a62B0861d8F2B946456Ba9dCD0F3BAeC54147',
        symbol: 'WBTC',
        name: 'Wrapped Bitcoin'
      }
    }
  },
  {
    chainId: NETWORK.optimism_sepolia,
    address: '0xEd2f166aD10b247f67C3FcE7a4C8e0C5E54247ea',
    name: 'Prize WETH',
    decimals: 18,
    symbol: 'pWETH',
    logoURI: 'https://etherscan.io/token/images/weth_28.png',
    extensions: {
      underlyingAsset: {
        address: '0x4a61B6f54157840E80e0C47f1A628C0B3744a739',
        symbol: 'WETH',
        name: 'Wrapped Ether'
      }
    }
  },
  {
    chainId: NETWORK.base_sepolia,
    address: '0x8Ec8328d3281F8275d6b44ffAdA9DF002B928AEa',
    name: 'Prize POOL',
    decimals: 18,
    symbol: 'pPOOL',
    logoURI: 'https://etherscan.io/token/images/pooltogether_32.png',
    extensions: {
      underlyingAsset: {
        address: '0x50Ac98a0CA373a3935069A8755D895663d2F4A16',
        symbol: 'POOL',
        name: 'PoolTogether'
      }
    }
  },
  {
    chainId: NETWORK.base_sepolia,
    address: '0x513cd9e4d06e86acfda1c5e7b93c4a3400d240d7',
    name: 'Prize DAI',
    decimals: 18,
    symbol: 'pDAI',
    logoURI: 'https://assets.coingecko.com/coins/images/9956/small/4943.png?1636636734',
    extensions: {
      underlyingAsset: {
        address: '0xe4B4A71923AecB4b8924bDA8C31941a8Ab50FF86',
        symbol: 'DAI',
        name: 'Dai Stablecoin'
      }
    }
  },
  {
    chainId: NETWORK.base_sepolia,
    address: '0xb974ba187814913d0415d1d0feda77febd3f2b32',
    name: 'Prize USDC',
    decimals: 6,
    symbol: 'pUSDC',
    logoURI: 'https://etherscan.io/token/images/centre-usdc_28.png',
    extensions: {
      underlyingAsset: {
        address: '0x034109D90E70B972617e96b33295E724FfF5887a',
        symbol: 'USDC',
        name: 'USD Coin'
      }
    }
  },
  {
    chainId: NETWORK.base_sepolia,
    address: '0xb948ad19895b36833c52ba1da5a77320d040ddbd',
    name: 'Prize WETH',
    decimals: 18,
    symbol: 'pWETH',
    logoURI: 'https://etherscan.io/token/images/weth_28.png',
    extensions: {
      underlyingAsset: {
        address: '0x019Aa44D02715e4042b1BA3b4D2FA9bCEF33c002',
        symbol: 'WETH',
        name: 'Wrapped Ether'
      }
    }
  },
  {
    chainId: NETWORK.arbitrum_sepolia,
    address: '0xB608C0F9d37B14BDFEfc654B1FC8F38b34541a01',
    name: 'Prize POOL',
    decimals: 18,
    symbol: 'pPOOL',
    logoURI: 'https://etherscan.io/token/images/pooltogether_32.png',
    extensions: {
      underlyingAsset: {
        address: '0x02A32F041C16158bcC1CaA90e22B230958eD5c4b',
        symbol: 'POOL',
        name: 'PoolTogether'
      }
    }
  },
  {
    chainId: NETWORK.arbitrum_sepolia,
    address: '0xca45845b69c441a5d319e36c8aacd99df806e95d',
    name: 'Prize DAI',
    decimals: 18,
    symbol: 'pDAI',
    logoURI: 'https://assets.coingecko.com/coins/images/9956/small/4943.png?1636636734',
    extensions: {
      underlyingAsset: {
        address: '0xFE045BEEfdA06606fc5f441ccCa2fE8C903e9725',
        symbol: 'DAI',
        name: 'Dai Stablecoin'
      }
    }
  },
  {
    chainId: NETWORK.arbitrum_sepolia,
    address: '0xba9926560c2161761f1d438b3eb7884df02436bb',
    name: 'Prize USDC',
    decimals: 6,
    symbol: 'pUSDC',
    logoURI: 'https://etherscan.io/token/images/centre-usdc_28.png',
    extensions: {
      underlyingAsset: {
        address: '0x7B2E0BD66ef04d26db132391b5600aF3887E9f9F',
        symbol: 'USDC',
        name: 'USD Coin'
      }
    }
  },
  {
    chainId: NETWORK.arbitrum_sepolia,
    address: '0x9b47c08d066184e65efb82828e53c0ad1729f992',
    name: 'Prize WETH',
    decimals: 18,
    symbol: 'pWETH',
    logoURI: 'https://etherscan.io/token/images/weth_28.png',
    extensions: {
      underlyingAsset: {
        address: '0x060faD1bCA90E5b1EFca0d93FEBeC96E638fD8A6',
        symbol: 'WETH',
        name: 'Wrapped Ether'
      }
    }
  }
]
