import { NETWORK } from '@shared/utilities'
import {
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  gnosis,
  gnosisChiado,
  mainnet,
  optimism,
  optimismSepolia,
  scroll,
  scrollSepolia,
  worldchain
} from 'viem/chains'

/**
 * Supported networks
 */
export const SUPPORTED_NETWORKS = {
  mainnets: [
    NETWORK.mainnet,
    NETWORK.optimism,
    NETWORK.base,
    NETWORK.arbitrum,
    NETWORK.scroll,
    NETWORK.gnosis,
    NETWORK.world
  ],
  testnets: [
    NETWORK.optimism_sepolia,
    NETWORK.arbitrum_sepolia,
    NETWORK.base_sepolia,
    NETWORK.scroll_sepolia,
    NETWORK.gnosis_chiado
  ]
} as const

/**
 * Wagmi networks
 */
export const WAGMI_CHAINS = {
  [NETWORK.mainnet]: mainnet,
  [NETWORK.optimism]: optimism,
  [NETWORK.arbitrum]: arbitrum,
  [NETWORK.base]: base,
  [NETWORK.scroll]: scroll,
  [NETWORK.gnosis]: gnosis,
  [NETWORK.world]: worldchain,
  [NETWORK.optimism_sepolia]: optimismSepolia,
  [NETWORK.arbitrum_sepolia]: arbitrumSepolia,
  [NETWORK.base_sepolia]: baseSepolia,
  [NETWORK.scroll_sepolia]: scrollSepolia,
  [NETWORK.gnosis_chiado]: gnosisChiado
} as const

/**
 * RPCs
 */
export const RPC_URLS = {
  [NETWORK.mainnet]: process.env.NEXT_PUBLIC_MAINNET_RPC_URL,
  [NETWORK.optimism]: process.env.NEXT_PUBLIC_OPTIMISM_RPC_URL,
  [NETWORK.arbitrum]: process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL,
  [NETWORK.base]: process.env.NEXT_PUBLIC_BASE_RPC_URL,
  [NETWORK.scroll]: process.env.NEXT_PUBLIC_SCROLL_RPC_URL,
  [NETWORK.gnosis]: process.env.NEXT_PUBLIC_GNOSIS_RPC_URL,
  [NETWORK.world]: process.env.NEXT_PUBLIC_WORLD_RPC_URL,
  [NETWORK.optimism_sepolia]: process.env.NEXT_PUBLIC_OPTIMISM_SEPOLIA_RPC_URL,
  [NETWORK.arbitrum_sepolia]: process.env.NEXT_PUBLIC_ARBITRUM_SEPOLIA_RPC_URL,
  [NETWORK.base_sepolia]: process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL,
  [NETWORK.scroll_sepolia]: process.env.NEXT_PUBLIC_SCROLL_SEPOLIA_RPC_URL,
  [NETWORK.gnosis_chiado]: process.env.NEXT_PUBLIC_GNOSIS_CHIADO_RPC_URL
} as const
