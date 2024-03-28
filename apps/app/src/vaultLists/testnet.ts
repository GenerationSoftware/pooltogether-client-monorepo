import { VaultList } from '@shared/types'
import { NETWORK } from '@shared/utilities'

export const testnetVaults: VaultList['tokens'] = [
  {
    chainId: NETWORK.optimism_sepolia,
    address: '0x8f8484f30F7A72c8059E6BD709f898606e38DedA',
    name: 'Prize DAI - LY',
    decimals: 18,
    symbol: 'PDAI-LY',
    logoURI: 'https://assets.coingecko.com/coins/images/9956/small/4943.png?1636636734',
    extensions: {
      underlyingAsset: {
        address: '0x8261Cb9519DD1D80B5ce66B0887C6fCEeA8a64eE',
        symbol: 'DAI',
        name: 'Dai Stablecoin'
      }
    }
  },
  {
    chainId: NETWORK.optimism_sepolia,
    address: '0x5B0182E62Baee8Be36AC15696E5C78A0c89b465F',
    name: 'Prize DAI - HY',
    decimals: 18,
    symbol: 'PDAI-HY',
    logoURI: 'https://assets.coingecko.com/coins/images/9956/small/4943.png?1636636734',
    extensions: {
      underlyingAsset: {
        address: '0x8261Cb9519DD1D80B5ce66B0887C6fCEeA8a64eE',
        symbol: 'DAI',
        name: 'Dai Stablecoin'
      }
    }
  },
  {
    chainId: NETWORK.optimism_sepolia,
    address: '0x383E8D88De4E3999b43C51cA1819516617260e99',
    name: 'Prize USDC - LY',
    decimals: 6,
    symbol: 'PUSDC-LY',
    logoURI: 'https://etherscan.io/token/images/centre-usdc_28.png',
    extensions: {
      underlyingAsset: {
        address: '0x0E13bF42f927575475894f2d5076a7Ac77060eA0',
        symbol: 'USDC',
        name: 'USD Coin'
      }
    }
  },
  {
    chainId: NETWORK.optimism_sepolia,
    address: '0xe8AD34CB77b8DCE62DEd796DCB10b8f574d6A619',
    name: 'Prize USDC - HY',
    decimals: 6,
    symbol: 'PUSDC-HY',
    logoURI: 'https://etherscan.io/token/images/centre-usdc_28.png',
    extensions: {
      underlyingAsset: {
        address: '0x0E13bF42f927575475894f2d5076a7Ac77060eA0',
        symbol: 'USDC',
        name: 'USD Coin'
      }
    }
  },
  {
    chainId: NETWORK.optimism_sepolia,
    address: '0x7eb63F62f2E1E4646793D3dA9C1A232A5f5710B5',
    name: 'Prize GUSD',
    decimals: 2,
    symbol: 'PGUSD',
    logoURI:
      'https://assets.coingecko.com/coins/images/5992/small/gemini-dollar-gusd.png?1536745278',
    extensions: {
      underlyingAsset: {
        address: '0x493c7081FAab6e5B2d6b18d9311918580e88c6bF',
        symbol: 'GUSD',
        name: 'Gemini dollar'
      }
    }
  },
  {
    chainId: NETWORK.optimism_sepolia,
    address: '0x1B751A1F3b558173DF9832d4564E6B38db7552c6',
    name: 'Prize WBTC',
    decimals: 8,
    symbol: 'PWBTC',
    logoURI: 'https://etherscan.io/token/images/wbtc_28.png?v=1',
    extensions: {
      underlyingAsset: {
        address: '0x45bbc6B553D2Afc4d3e376B22f70A67d9a26f819',
        symbol: 'WBTC',
        name: 'Wrapped BTC'
      }
    }
  },
  {
    chainId: NETWORK.optimism_sepolia,
    address: '0xf04Aa80EaC0043C8F8328Dd35385aaf2C0ed8E9a',
    name: 'Prize WETH',
    decimals: 18,
    symbol: 'PWETH',
    logoURI: 'https://etherscan.io/token/images/weth_28.png',
    extensions: {
      underlyingAsset: {
        address: '0xD5C2a983D320a881F21Dc68fd89f905Ff1517B2C',
        symbol: 'WETH',
        name: 'Wrapped Ether'
      }
    }
  }
]
