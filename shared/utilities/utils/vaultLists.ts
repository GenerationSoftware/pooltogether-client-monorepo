import { VaultList, Version } from '@shared/types'
import { createPublicClient, http, PublicClient } from 'viem'
import { mainnet } from 'viem/chains'
import { normalize } from 'viem/ens'

/**
 * Returns a vault list object from an HTTP URL, IPFS/IPNS hash or ENS domain
 *
 * NOTE: If a public client is not provided, a default public RPC will be used for ENS content queries
 * @param src the source of the vault list
 * @param publicClient a public client to query ENS content through
 * @returns
 */
export const getVaultList = async (src: string, publicClient?: PublicClient) => {
  let vaultList: VaultList | undefined

  if (src.startsWith('http://') || src.startsWith('https://')) {
    const response = await fetch(src)
    vaultList = await response.json()
  } else if (src.startsWith('ipfs://')) {
    const response = await fetch(`https://dweb.link/ipfs/${src.slice(7)}`)
    vaultList = await response.json()
  } else if (src.startsWith('ipns://')) {
    const response = await fetch(`https://dweb.link/ipns/${src.slice(7)}`)
    vaultList = await response.json()
  } else if (src.endsWith('.eth')) {
    const clientChainId = await publicClient?.getChainId()
    const client = !!clientChainId
      ? publicClient
      : createPublicClient({ chain: mainnet, transport: http() })
    const response = await client?.getEnsText({ name: normalize(src), key: 'vaultList' })
    vaultList = !!response ? await getVaultList(response) : undefined
  } else {
    vaultList = !!src ? JSON.parse(src) : undefined
  }

  return isValidVaultList(vaultList) ? vaultList : undefined
}

// TODO: check optional params as well
/**
 * Returns true if the given vault list object is valid
 * @param vaultList a vault list to check for validity
 * @returns
 */
export const isValidVaultList = (vaultList?: VaultList) => {
  const isObject = !!vaultList && typeof vaultList === 'object'

  if (isObject) {
    const isValidName = !!vaultList.name && typeof vaultList.name === 'string'
    const isValidVersion =
      !!vaultList.version &&
      typeof vaultList.version === 'object' &&
      vaultList.version.major !== undefined &&
      typeof vaultList.version.major === 'number' &&
      vaultList.version.minor !== undefined &&
      typeof vaultList.version.minor === 'number' &&
      vaultList.version.patch !== undefined &&
      typeof vaultList.version.patch === 'number'
    const isValidTimestamp = !!vaultList.timestamp && typeof vaultList.timestamp === 'string'
    const isValidTokens =
      !!vaultList.tokens &&
      typeof vaultList.tokens === 'object' &&
      vaultList.tokens.every(
        (vault) =>
          !!vault.chainId &&
          typeof vault.chainId === 'number' &&
          !!vault.address &&
          typeof vault.address === 'string'
      )

    return isValidName && isValidVersion && isValidTimestamp && isValidTokens
  } else {
    return false
  }
}

/**
 * Returns true if version `A` is newer (more recent, higher value) than version `B`
 * @param a version A
 * @param b version B
 * @returns
 */
export const isNewerVersion = (a: Version, b: Version) => {
  return (
    a.major > b.major ||
    (a.major === b.major && a.minor > b.minor) ||
    (a.major === b.major && a.minor === b.minor && a.patch > b.patch)
  )
}
