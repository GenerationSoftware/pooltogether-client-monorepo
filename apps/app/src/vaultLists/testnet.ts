import { VaultList } from '@shared/types'
import { NETWORK } from '@shared/utilities'

export const testnetVaults: VaultList['tokens'] = [
  {
    chainId: NETWORK.optimism_sepolia,
    address: '0x75B2F4b3eC5aDF7077F928992524Cc547E74f768',
    name: 'Prize POOL',
    decimals: 18,
    symbol: 'pPOOL',
    logoURI: 'https://etherscan.io/token/images/pooltogether_32.png',
    extensions: {
      underlyingAsset: {
        address: '0x588bEdb06E351Ce014b893Fe41d633a147444efb',
        symbol: 'POOL',
        name: 'PoolTogether'
      }
    }
  },
  {
    chainId: NETWORK.optimism_sepolia,
    address: '0xC0832B2d1380eC5550F86cd6C6bC2E9402C1f55C',
    name: 'Prize DAI',
    decimals: 18,
    symbol: 'pDAI',
    logoURI: 'https://assets.coingecko.com/coins/images/9956/small/4943.png?1636636734',
    extensions: {
      underlyingAsset: {
        address: '0x002183F0d3f1b59e181Db1f250Ce69b97539ae96',
        symbol: 'DAI',
        name: 'Dai Stablecoin'
      }
    }
  },
  {
    chainId: NETWORK.optimism_sepolia,
    address: '0x7FAD91A4A29109303188D8758F1a9D60cE988349',
    name: 'Prize USDC',
    decimals: 6,
    symbol: 'pUSDC',
    logoURI: 'https://etherscan.io/token/images/centre-usdc_28.png',
    extensions: {
      underlyingAsset: {
        address: '0x539486f74DbEb345ef5DB41151a8fd17a2d7e4Dd',
        symbol: 'USDC',
        name: 'USD Coin'
      }
    }
  },
  {
    chainId: NETWORK.optimism_sepolia,
    address: '0xe590741416acBdBA094F7D70BEAef6060cc6D21E',
    name: 'Prize GUSD',
    decimals: 2,
    symbol: 'pGUSD',
    logoURI:
      'https://assets.coingecko.com/coins/images/5992/small/gemini-dollar-gusd.png?1536745278',
    extensions: {
      underlyingAsset: {
        address: '0x71A9828e4adD469c89A610291147b0B5AC1Ad80b',
        symbol: 'GUSD',
        name: 'Gemini Dollar'
      }
    }
  },
  {
    chainId: NETWORK.optimism_sepolia,
    address: '0xdEA4278d8b01B71523bfD6a8Fc36fea67F349e47',
    name: 'Prize WBTC',
    decimals: 8,
    symbol: 'pWBTC',
    logoURI: 'https://etherscan.io/token/images/wbtc_28.png?v=1',
    extensions: {
      underlyingAsset: {
        address: '0x9cb3E04A48DB197Cd26492FAfD2a6bE6E815262A',
        symbol: 'WBTC',
        name: 'Wrapped Bitcoin'
      }
    }
  },
  {
    chainId: NETWORK.optimism_sepolia,
    address: '0x33335296c9b020ca3252E4953C11decFDce816B8',
    name: 'Prize WETH',
    decimals: 18,
    symbol: 'pWETH',
    logoURI: 'https://etherscan.io/token/images/weth_28.png',
    extensions: {
      underlyingAsset: {
        address: '0xC355F97a3Aa2808Acb536E555764b8FB26fB4b37',
        symbol: 'WETH',
        name: 'Wrapped Ether'
      }
    }
  }
]
