import { VaultList } from '@shared/types'
import { NETWORK } from '@shared/utilities'

export const testnetVaults: VaultList['tokens'] = [
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
  },
  {
    chainId: NETWORK['optimism-sepolia'],
    address: '0x22c6258ea5b1E742d18C27D846E2AaBd4505EDC2',
    name: 'Prize DAI - LY',
    decimals: 18,
    symbol: 'PDAI-LY',
    logoURI: 'https://assets.coingecko.com/coins/images/9956/small/4943.png?1636636734',
    extensions: {
      underlyingAsset: {
        address: '0xD590EC14364731B62265A5cc807164a17C6797D4',
        symbol: 'DAI',
        name: 'Dai Stablecoin'
      }
    }
  },
  {
    chainId: NETWORK['optimism-sepolia'],
    address: '0x15E5b4813942fa51835ceb7Aff13F771C398d062',
    name: 'Prize DAI - HY',
    decimals: 18,
    symbol: 'PDAI-HY',
    logoURI: 'https://assets.coingecko.com/coins/images/9956/small/4943.png?1636636734',
    extensions: {
      underlyingAsset: {
        address: '0xD590EC14364731B62265A5cc807164a17C6797D4',
        symbol: 'DAI',
        name: 'Dai Stablecoin'
      }
    }
  },
  {
    chainId: NETWORK['optimism-sepolia'],
    address: '0x2891d69786650260B9F99A7b333058FCC5418Df0',
    name: 'Prize USDC - LY',
    decimals: 6,
    symbol: 'PUSDC-LY',
    logoURI: 'https://etherscan.io/token/images/centre-usdc_28.png',
    extensions: {
      underlyingAsset: {
        address: '0x8067F3Cb6Eef936256108FF19a05574b8aD99Cf3',
        symbol: 'USDC',
        name: 'USD Coin'
      }
    }
  },
  {
    chainId: NETWORK['optimism-sepolia'],
    address: '0xa3976b09b9695DFABc39a2E042F5bD5B7399Ac60',
    name: 'Prize USDC - HY',
    decimals: 6,
    symbol: 'PUSDC-HY',
    logoURI: 'https://etherscan.io/token/images/centre-usdc_28.png',
    extensions: {
      underlyingAsset: {
        address: '0x8067F3Cb6Eef936256108FF19a05574b8aD99Cf3',
        symbol: 'USDC',
        name: 'USD Coin'
      }
    }
  },
  {
    chainId: NETWORK['optimism-sepolia'],
    address: '0xD04756fe8b7A33741e1fA3A4dDD7e0075A0063aC',
    name: 'Prize GUSD',
    decimals: 2,
    symbol: 'PGUSD',
    logoURI:
      'https://assets.coingecko.com/coins/images/5992/small/gemini-dollar-gusd.png?1536745278',
    extensions: {
      underlyingAsset: {
        address: '0x1A188719711d62423abF1A4de7D8aA9014A39D73',
        symbol: 'GUSD',
        name: 'Gemini dollar'
      }
    }
  },
  {
    chainId: NETWORK['optimism-sepolia'],
    address: '0xbE4E7D33a1144e977C3A2f51798cc451E1a76B2f',
    name: 'Prize WBTC',
    decimals: 8,
    symbol: 'PWBTC',
    logoURI: 'https://etherscan.io/token/images/wbtc_28.png?v=1',
    extensions: {
      underlyingAsset: {
        address: '0x149e3B3Bd69f1Cfc1B42b6A6a152a42E38cEeBf1',
        symbol: 'WBTC',
        name: 'Wrapped BTC'
      }
    }
  },
  {
    chainId: NETWORK['optimism-sepolia'],
    address: '0xaf25FfB53699AeDba3dAf97Bb2adc1B5054053EA',
    name: 'Prize WETH',
    decimals: 18,
    symbol: 'PWETH',
    logoURI: 'https://etherscan.io/token/images/weth_28.png',
    extensions: {
      underlyingAsset: {
        address: '0xA416eD51158c5616b997B785FA6d18f02D0458A8',
        symbol: 'WETH',
        name: 'Wrapped Ether'
      }
    }
  },
  {
    chainId: NETWORK['optimism-sepolia'],
    address: '0x51d439F705911634263DFE265097645Eb1A3C42a',
    name: 'Prize WETH - Test WETH',
    decimals: 18,
    symbol: 'pWETH',
    logoURI: 'https://etherscan.io/token/images/weth_28.png',
    extensions: {
      underlyingAsset: {
        address: '0xA416eD51158c5616b997B785FA6d18f02D0458A8',
        symbol: 'WETH',
        name: 'Wrapped Ether'
      }
    }
  },
  {
    chainId: NETWORK['arbitrum-sepolia'],
    address: '0x3adaa1D4F23C82130e1681c2cA9b38f5Fb9a0892',
    name: 'Prize DAI - LY',
    decimals: 18,
    symbol: 'PDAI-LY',
    logoURI: 'https://assets.coingecko.com/coins/images/9956/small/4943.png?1636636734',
    extensions: {
      underlyingAsset: {
        address: '0x08C19FE57af150a1AF975CB9a38769848c7DF98e',
        symbol: 'DAI',
        name: 'Dai Stablecoin'
      }
    }
  },
  {
    chainId: NETWORK['arbitrum-sepolia'],
    address: '0x4DBF73fe0D23A6d275aeFebC7C00600045aB8B9E',
    name: 'Prize DAI - HY',
    decimals: 18,
    symbol: 'PDAI-HY',
    logoURI: 'https://assets.coingecko.com/coins/images/9956/small/4943.png?1636636734',
    extensions: {
      underlyingAsset: {
        address: '0x08C19FE57af150a1AF975CB9a38769848c7DF98e',
        symbol: 'DAI',
        name: 'Dai Stablecoin'
      }
    }
  },
  {
    chainId: NETWORK['arbitrum-sepolia'],
    address: '0xA723Cf5D90c1A472c7de7285e5bD314AeA107EDe',
    name: 'Prize USDC - LY',
    decimals: 6,
    symbol: 'PUSDC-LY',
    logoURI: 'https://etherscan.io/token/images/centre-usdc_28.png',
    extensions: {
      underlyingAsset: {
        address: '0x7A6DBc7fF4f1a2D864291DB3AeC105A8EeE4A3D2',
        symbol: 'USDC',
        name: 'USD Coin'
      }
    }
  },
  {
    chainId: NETWORK['arbitrum-sepolia'],
    address: '0xb81b725b16e99c840Ac17B396590da9c93c5bc3B',
    name: 'Prize USDC - HY',
    decimals: 6,
    symbol: 'PUSDC-HY',
    logoURI: 'https://etherscan.io/token/images/centre-usdc_28.png',
    extensions: {
      underlyingAsset: {
        address: '0x7A6DBc7fF4f1a2D864291DB3AeC105A8EeE4A3D2',
        symbol: 'USDC',
        name: 'USD Coin'
      }
    }
  },
  {
    chainId: NETWORK['arbitrum-sepolia'],
    address: '0xf028016D98eBA8fB9d56e9dee04e4639C724E6ae',
    name: 'Prize GUSD',
    decimals: 2,
    symbol: 'PGUSD',
    logoURI:
      'https://assets.coingecko.com/coins/images/5992/small/gemini-dollar-gusd.png?1536745278',
    extensions: {
      underlyingAsset: {
        address: '0xB84460D777133a4B86540D557dB35952e4ADFeE7',
        symbol: 'GUSD',
        name: 'Gemini dollar'
      }
    }
  },
  {
    chainId: NETWORK['arbitrum-sepolia'],
    address: '0xF79C5f53399492308195b1417B8DfaE47e4efD75',
    name: 'Prize WBTC',
    decimals: 8,
    symbol: 'PWBTC',
    logoURI: 'https://etherscan.io/token/images/wbtc_28.png?v=1',
    extensions: {
      underlyingAsset: {
        address: '0x1Bc266E1F397517ECe9e384c55C7A5414b683639',
        symbol: 'WBTC',
        name: 'Wrapped BTC'
      }
    }
  },
  {
    chainId: NETWORK['arbitrum-sepolia'],
    address: '0x5e733FC64179B18986ffa6D840023c99707984ad',
    name: 'Prize WETH',
    decimals: 18,
    symbol: 'PWETH',
    logoURI: 'https://etherscan.io/token/images/weth_28.png',
    extensions: {
      underlyingAsset: {
        address: '0x779275Fc1b987dB24463801f3708f42f3c6f6Ceb',
        symbol: 'WETH',
        name: 'Wrapped Ether'
      }
    }
  },
  {
    chainId: NETWORK['arbitrum-sepolia'],
    address: '0xa5905161eAb67b6A13104537a09A949EF043366E',
    name: 'Prize WETH - Test WETH',
    decimals: 18,
    symbol: 'PWETH',
    logoURI: 'https://etherscan.io/token/images/weth_28.png',
    extensions: {
      underlyingAsset: {
        address: '0x779275Fc1b987dB24463801f3708f42f3c6f6Ceb',
        symbol: 'WETH',
        name: 'Wrapped Ether'
      }
    }
  }
]
