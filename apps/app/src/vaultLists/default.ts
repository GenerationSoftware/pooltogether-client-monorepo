import { VaultList } from '@shared/types'
import { LINKS } from '@shared/ui'
import { NETWORK } from '@shared/utilities'

const defaultVaultList: VaultList = {
  name: 'Cabana Vault List',
  keywords: ['pooltogether', 'cabana', 'g9', 'optimism'],
  version: { major: 1, minor: 0, patch: 0 },
  timestamp: '2023-10-18T23:53:23.588Z',
  logoURI: `${LINKS.app}/pooltogether-token-logo.svg`,
  tokens: [
    {
      chainId: NETWORK.optimism,
      address: '0xE3B3a464ee575E8E25D2508918383b89c832f275',
      name: 'Prize USDC.e - Aave',
      decimals: 6,
      symbol: 'pUSDC.e',
      logoURI: 'https://etherscan.io/token/images/centre-usdc_28.png', // TODO: add custom vault logo
      yieldSourceURI:
        'https://app.aave.com/reserve-overview/?underlyingAsset=0x7f5c764cbc14f9669b88837ca1490cca17c31607&marketName=proto_optimism_v3',
      extensions: {
        underlyingAsset: {
          address: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
          symbol: 'USDC.e',
          name: 'USDC (Bridged from Ethereum)'
        }
      }
    },
    {
      chainId: NETWORK.optimism,
      address: '0x29Cb69D4780B53c1e5CD4D2B817142D2e9890715',
      name: 'Prize WETH - Aave',
      decimals: 18,
      symbol: 'pWETH',
      logoURI: 'https://etherscan.io/token/images/weth_28.png', // TODO: add custom vault logo
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
      chainId: NETWORK['optimism-goerli'],
      address: '0x9e025155f7BD3b17E26bCE811F7B6F075973570A',
      name: 'Prize DAI - LY',
      decimals: 18,
      symbol: 'PDAI-LY',
      logoURI: 'https://assets.coingecko.com/coins/images/9956/small/4943.png?1636636734',
      extensions: {
        underlyingAsset: {
          address: '0x4D07Ba104ff254c19B443aDE6224f744Db84FB8A',
          symbol: 'DAI',
          name: 'Dai Stablecoin'
        }
      }
    },
    {
      chainId: NETWORK['optimism-goerli'],
      address: '0xbC6d40984ddB1482BBBF1433c1C1f0380f74caCD',
      name: 'Prize DAI - HY',
      decimals: 18,
      symbol: 'PDAI-HY',
      logoURI: 'https://assets.coingecko.com/coins/images/9956/small/4943.png?1636636734',
      extensions: {
        underlyingAsset: {
          address: '0x4D07Ba104ff254c19B443aDE6224f744Db84FB8A',
          symbol: 'DAI',
          name: 'Dai Stablecoin'
        }
      }
    },
    {
      chainId: NETWORK['optimism-goerli'],
      address: '0x1eAdB947b1e66ff3575F9Fd0FD4fB4Cc8fcAD8Fd',
      name: 'Prize USDC - LY',
      decimals: 6,
      symbol: 'PUSDC-LY',
      logoURI: 'https://etherscan.io/token/images/centre-usdc_28.png',
      extensions: {
        underlyingAsset: {
          address: '0xB7930c829cc1de1b37a3Bb9b477E33251DA15a50',
          symbol: 'USDC',
          name: 'USD Coin'
        }
      }
    },
    {
      chainId: NETWORK['optimism-goerli'],
      address: '0xc3d6a8d76B304E0716b3227C00a83187340DC846',
      name: 'Prize USDC - HY',
      decimals: 6,
      symbol: 'PUSDC-HY',
      logoURI: 'https://etherscan.io/token/images/centre-usdc_28.png',
      extensions: {
        underlyingAsset: {
          address: '0xB7930c829cc1de1b37a3Bb9b477E33251DA15a50',
          symbol: 'USDC',
          name: 'USD Coin'
        }
      }
    },
    {
      chainId: NETWORK['optimism-goerli'],
      address: '0xb1AF8E57033a0f5B5Db37C2B2E8C4a357514d2B5',
      name: 'Prize GUSD',
      decimals: 2,
      symbol: 'PGUSD',
      logoURI:
        'https://assets.coingecko.com/coins/images/5992/small/gemini-dollar-gusd.png?1536745278',
      extensions: {
        underlyingAsset: {
          address: '0x041a898Bc37129d2D2232163c3374f4077255F74',
          symbol: 'GUSD',
          name: 'Gemini dollar'
        }
      }
    },
    {
      chainId: NETWORK['optimism-goerli'],
      address: '0xa2574ee88D049Df4CdC8DEc746842C7615FBF5A5',
      name: 'Prize WBTC',
      decimals: 8,
      symbol: 'PWBTC',
      logoURI: 'https://etherscan.io/token/images/wbtc_28.png?v=1',
      extensions: {
        underlyingAsset: {
          address: '0x331cDB619147A20c32e7B9391A4797Ed9656B104',
          symbol: 'WBTC',
          name: 'Wrapped BTC'
        }
      }
    },
    {
      chainId: NETWORK['optimism-goerli'],
      address: '0xEF9aFd8b3701198cCac6bf55458C38F61C4b55c4',
      name: 'Prize WETH',
      decimals: 18,
      symbol: 'PWETH',
      logoURI: 'https://etherscan.io/token/images/weth_28.png',
      extensions: {
        underlyingAsset: {
          address: '0xB8e70B16b8d99753ce55F0E4C2A7eCeeecE30B64',
          symbol: 'WETH',
          name: 'Wrapped Ether'
        }
      }
    }
  ]
}

export default defaultVaultList
