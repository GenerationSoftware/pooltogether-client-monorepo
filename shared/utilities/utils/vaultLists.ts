import { VaultList, Version } from '@shared/types'
import Ajv from 'ajv'
import { VAULT_LIST_SCHEMA } from '../constants'

const ajv = new Ajv()
const isValidVaultList = ajv.compile(VAULT_LIST_SCHEMA)

/**
 * Returns a vault list object from an HTTP URL, IPFS/IPNS hash or ENS domain
 * @param src the source of the vault list
 * @returns
 */
export const getVaultList = async (src: string) => {
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
    // TODO: ens resolution
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
