import { TokenWithSupply, VaultInfo, VaultList, VaultListTags, Version } from '@shared/types'
import { getVaultId } from '@shared/utilities'
import { Chain, fallback, http, Transport } from 'viem'
import { createConfig } from 'wagmi'
import { RPC_URLS, SUPPORTED_NETWORKS, WAGMI_CHAINS } from '@constants/config'
import { MutableVaultList } from './types'

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
 * Returns a formatted vault list with given share and token data
 * @param data as much data as possible to format a vault list
 * @returns
 */
export const getFormattedVaultList = (data: {
  name: string
  version?: Version
  timestamp?: string
  tokens: VaultInfo[]
  keywords?: string[]
  tags?: VaultListTags
  logoURI?: string
  shareData?: { [vaultId: string]: TokenWithSupply }
  tokenData?: { [vaultId: string]: TokenWithSupply }
}): VaultList => {
  const defaultVersion: Version = { major: 1, minor: 0, patch: 0 }
  const defaultTimestamp = new Date().toISOString()

  const vaultList: MutableVaultList = {
    name: data.name,
    version: data.version ?? defaultVersion,
    timestamp: data.timestamp ?? defaultTimestamp,
    keywords: data.keywords,
    tags: data.tags,
    logoURI: data.logoURI,
    tokens: data.tokens
  }

  vaultList.tokens.forEach((vaultInfo, i) => {
    const vaultId = getVaultId(vaultInfo)

    const shareData = data.shareData?.[vaultId]
    const tokenData = data.tokenData?.[vaultId]

    if (!!shareData) {
      if (!vaultInfo.name) {
        vaultList.tokens[i].name = shareData.name
      }
      vaultList.tokens[i].decimals = shareData.decimals
      vaultList.tokens[i].symbol = shareData.symbol
    }

    if (!!tokenData) {
      if (vaultList.tokens[i].extensions === undefined) {
        vaultList.tokens[i].extensions = {}
      }
      // @ts-ignore
      if (vaultList.tokens[i].extensions.underlyingAsset === undefined) {
        // @ts-ignore
        vaultList.tokens[i].extensions.underlyingAsset = {}
      }
      // @ts-ignore
      vaultList.tokens[i].extensions.underlyingAsset.address = tokenData.address
      // @ts-ignore
      vaultList.tokens[i].extensions.underlyingAsset.symbol = tokenData.symbol
      // @ts-ignore
      vaultList.tokens[i].extensions.underlyingAsset.name = tokenData.name
    }
  })

  return vaultList
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
