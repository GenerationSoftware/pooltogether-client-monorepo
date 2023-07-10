import { VaultList, Version } from '@shared/types'
import Ajv from 'ajv'
import { createPublicClient, http, PublicClient } from 'viem'
import { mainnet } from 'viem/chains'
import { normalize } from 'viem/ens'
import { VAULT_LIST_SCHEMA } from '../constants'

const ajv = new Ajv()
const isValidVaultList = ajv.compile(VAULT_LIST_SCHEMA)

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
    vaultList = !!response ? JSON.parse(response) : undefined
  }

  return isValidVaultList(vaultList) ? vaultList : undefined
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
