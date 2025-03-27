import { dolphinAddress } from 'dskit-eth'
import { Address, Chain } from 'viem'
import { arbitrum, base, gnosis, mainnet, optimism, polygon, scroll, worldchain } from 'viem/chains'
import { SUPPORTED_NETWORK } from './types'

export const DEFAULT_HEADERS = {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
    'Access-Control-Request-Method': '*',
    'Vary': 'Accept-Encoding, Origin',
    'Access-Control-Allow-Headers': '*',
    'Content-Type': 'application/json;charset=UTF-8'
  }
}

export enum NETWORK {
  mainnet = 1,
  optimism = 10,
  polygon = 137,
  arbitrum = 42161,
  base = 8453,
  scroll = 534352,
  gnosis = 100,
  world = 480
}

export const SUPPORTED_NETWORKS = [
  NETWORK.mainnet,
  NETWORK.optimism,
  NETWORK.polygon,
  NETWORK.arbitrum,
  NETWORK.base,
  NETWORK.scroll,
  NETWORK.gnosis,
  NETWORK.world
] as const

export const NETWORK_KEYS = {
  [NETWORK.mainnet]: 'mainnet',
  [NETWORK.optimism]: 'optimism',
  [NETWORK.polygon]: 'polygon',
  [NETWORK.arbitrum]: 'arbitrum',
  [NETWORK.base]: 'base',
  [NETWORK.scroll]: 'scroll',
  [NETWORK.gnosis]: 'gnosis',
  [NETWORK.world]: 'world'
} as const satisfies Record<NETWORK, string>

export const VIEM_CHAINS: Record<NETWORK, Chain> = {
  [NETWORK.mainnet]: mainnet,
  [NETWORK.optimism]: optimism,
  [NETWORK.polygon]: polygon,
  [NETWORK.arbitrum]: arbitrum,
  [NETWORK.base]: base,
  [NETWORK.scroll]: scroll,
  [NETWORK.gnosis]: gnosis,
  [NETWORK.world]: {
    ...worldchain,
    contracts: {
      multicall3: { address: '0xca11bde05977b3631167028862be2a173976ca11' }, // TODO: can remove once viem is updated to include this
      ...worldchain.contracts
    }
  }
}

export const RPC_URLS: Record<SUPPORTED_NETWORK, string> = {
  [NETWORK.mainnet]: MAINNET_RPC_URL,
  [NETWORK.optimism]: OPTIMISM_RPC_URL,
  [NETWORK.polygon]: POLYGON_RPC_URL,
  [NETWORK.arbitrum]: ARBITRUM_RPC_URL,
  [NETWORK.base]: BASE_RPC_URL,
  [NETWORK.scroll]: SCROLL_RPC_URL,
  [NETWORK.gnosis]: GNOSIS_RPC_URL,
  [NETWORK.world]: WORLD_RPC_URL
}

export const TOKEN_PRICE_REDIRECTS: Record<
  SUPPORTED_NETWORK,
  { [address: Lowercase<Address>]: { chainId: SUPPORTED_NETWORK; address: Lowercase<Address> } }
> = {
  [NETWORK.mainnet]: {
    /* ETH */
    [dolphinAddress]: {
      chainId: NETWORK.mainnet,
      address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
    },
    /* USDS */
    '0xdc035d45d973e3ec169d2276ddab16f1e407384f': {
      chainId: NETWORK.mainnet,
      address: '0x6b175474e89094c44da98b954eedeac495271d0f'
    },
    /* USDA */
    '0x0000206329b97db379d5e1bf586bbdb969c63274': {
      chainId: NETWORK.mainnet,
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
    }
  },
  [NETWORK.optimism]: {
    /* ETH */
    [dolphinAddress]: {
      chainId: NETWORK.optimism,
      address: '0x4200000000000000000000000000000000000006'
    },
    /* EURA */
    '0x9485aca5bbbe1667ad97c7fe7c4531a624c8b1ed': {
      chainId: NETWORK.mainnet,
      address: '0x1a7e4e63778b4f12a199c062f3efdd288afcbce8'
    },
    /* OVN */
    '0x3b08fcd15280e7b5a6e404c4abb87f7c774d1b2e': {
      chainId: NETWORK.base,
      address: '0xa3d1a8deb97b111454b294e2324efad13a9d8396'
    }
  },
  [NETWORK.polygon]: {
    /* MATIC */
    [dolphinAddress]: {
      chainId: NETWORK.polygon,
      address: '0x0000000000000000000000000000000000001010'
    },
    /* USDA */
    '0x0000206329b97db379d5e1bf586bbdb969c63274': {
      chainId: NETWORK.mainnet,
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
    }
  },
  [NETWORK.arbitrum]: {
    /* ETH */
    [dolphinAddress]: {
      chainId: NETWORK.arbitrum,
      address: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1'
    },
    /* POOL */
    '0xcf934e2402a5e072928a39a956964eb8f2b5b79c': {
      chainId: NETWORK.mainnet,
      address: '0x0cec1a9154ff802e7934fc916ed7ca50bde6844e'
    },
    /* USDA */
    '0x0000206329b97db379d5e1bf586bbdb969c63274': {
      chainId: NETWORK.mainnet,
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
    },
    /* crvUSD */
    '0x498bf2b1e120fed3ad3d42ea2165e9b73f99c1e5': {
      chainId: NETWORK.arbitrum,
      address: '0xaf88d065e77c8cc2239327c5edb3a432268e5831'
    }
  },
  [NETWORK.base]: {
    /* ETH */
    [dolphinAddress]: {
      chainId: NETWORK.base,
      address: '0x4200000000000000000000000000000000000006'
    }
  },
  [NETWORK.scroll]: {
    /* ETH */
    [dolphinAddress]: {
      chainId: NETWORK.mainnet,
      address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
    },
    /* POOL */
    '0xf9af83fc41e0cc2af2fba93644d542df6ea0f2b7': {
      chainId: NETWORK.mainnet,
      address: '0x0cec1a9154ff802e7934fc916ed7ca50bde6844e'
    },
    /* USDC */
    '0x06efdbff2a14a7c8e15944d1f4a48f9f95f663a4': {
      chainId: NETWORK.mainnet,
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
    },
    /* USDT */
    '0xf55bec9cafdbe8730f096aa55dad6d22d44099df': {
      chainId: NETWORK.mainnet,
      address: '0xdac17f958d2ee523a2206206994597c13d831ec7'
    }
  },
  [NETWORK.gnosis]: {
    /* XDAI */
    [dolphinAddress]: {
      chainId: NETWORK.mainnet,
      address: '0x6b175474e89094c44da98b954eedeac495271d0f'
    },
    /* POOL */
    '0x216a7d520992ed198593a16e0b17c784c9cdc660': {
      chainId: NETWORK.mainnet,
      address: '0x0cec1a9154ff802e7934fc916ed7ca50bde6844e'
    },
    /* WXDAI */
    '0xe91d153e0b41518a2ce8dd3d7944fa863463a97d': {
      chainId: NETWORK.mainnet,
      address: '0x6b175474e89094c44da98b954eedeac495271d0f'
    },
    /* USDC */
    '0xddafbb505ad214d7b80b1f830fccc89b60fb7a83': {
      chainId: NETWORK.mainnet,
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
    },
    /* WETH */
    '0x6a023ccd1ff6f2045c3309768ead9e68f978f6e1': {
      chainId: NETWORK.mainnet,
      address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
    },
    /* USDC.e */
    '0x2a22f9c3b484c3629090feed35f17ff8f88f76f0': {
      chainId: NETWORK.mainnet,
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
    }
  },
  [NETWORK.world]: {
    /* ETH */
    [dolphinAddress]: {
      chainId: NETWORK.mainnet,
      address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
    },
    /* WETH */
    '0x4200000000000000000000000000000000000006': {
      chainId: NETWORK.mainnet,
      address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
    },
    /* USDC */
    '0x79a02482a880bce3f13e09da970dc34db4cd24d1': {
      chainId: NETWORK.mainnet,
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
    },
    /* WLD */
    '0x2cfc85d8e48f8eab294be644d9e25c3030863003': {
      chainId: NETWORK.mainnet,
      address: '0x163f8c2467924be0ae7b5347228cabf260318753'
    },
    /* POOL */
    '0x7077c71b4af70737a08287e279b717dcf64fdc57': {
      chainId: NETWORK.mainnet,
      address: '0x0cec1a9154ff802e7934fc916ed7ca50bde6844e'
    }
  }
}
