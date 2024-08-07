import { Chain, fallback, http, Transport } from 'viem'
import { createConfig } from 'wagmi'
import { RPC_URLS, SUPPORTED_NETWORKS, WAGMI_CHAINS } from '@constants/config'

/**
 * Returns a Wagmi config with the given networks and RPCs
 * @returns
 */
export const createCustomWagmiConfig = () => {
  const networks = [...SUPPORTED_NETWORKS.mainnets, ...SUPPORTED_NETWORKS.testnets]

  const supportedNetworks = Object.values(WAGMI_CHAINS).filter(
    (chain) => networks.includes(chain.id) && !!RPC_URLS[chain.id]
  ) as any as [Chain, ...Chain[]]

  return createConfig({
    chains: supportedNetworks,
    transports: getNetworkTransports(supportedNetworks.map((network) => network.id)),
    batch: { multicall: { batchSize: 1_024 * 1_024 } },
    ssr: true
  })
}

/**
 * Returns network transports for Wagmi
 * @param networks the networks to get transports for
 * @returns
 */
const getNetworkTransports = (networks: (keyof typeof RPC_URLS)[]) => {
  const transports: { [chainId: number]: Transport } = {}

  networks.forEach((network) => {
    transports[network] = fallback([http(RPC_URLS[network]), http()])
  })

  return transports
}

/**
 * Returns true if the string only include valid characters, false otherwise
 *
 * This includes letters, numbers and some common symbols (".", "_", "-", "'")
 * @param str the string to check
 * @param options optional settings
 * @returns
 */
export const isValidChars = (str: string, options?: { allowSpaces?: boolean }) => {
  return !!str.match(options?.allowSpaces ? /^[a-z0-9._ '\-]+$/i : /^[a-z0-9._'\-]+$/i)
}
