import { VaultInfo } from '@shared/types'
import { getVaultId } from '@shared/utilities'
import { useAtom } from 'jotai'
import { useEffect, useMemo } from 'react'
import { vaultIdsAtom } from 'src/atoms'
import { isAddress } from 'viem'
import { LOCAL_STORAGE_KEYS } from '@constants/config'

/**
 * Returns a record of a user's deployed vaults and methods to update them
 */
export const useDeployedVaults = () => {
  const [vaultIds, setVaultIds] = useAtom(vaultIdsAtom)

  const addVault = (vaultInfo: VaultInfo) => {
    const vaultId = getVaultId(vaultInfo).toLowerCase()
    setVaultIds((prev) => Array.from(new Set<string>([...prev, vaultId])))
  }

  const removeVault = (vaultInfo: VaultInfo) => {
    const vaultId = getVaultId(vaultInfo).toLowerCase()
    setVaultIds((prev) => prev.filter((id) => id !== vaultId))
  }

  useEffect(() => localStorage.setItem(LOCAL_STORAGE_KEYS.vaultIds, vaultIds.join(',')), [vaultIds])

  const vaultInfoArray = useMemo(() => {
    return vaultIds
      .map((id) => {
        const [address, strChainId] = id.split('-')
        if (!!address && !!strChainId && isAddress(address)) {
          const chainId = parseInt(strChainId)
          return { chainId, address }
        }
      })
      .filter((v) => !!v) as VaultInfo[]
  }, [vaultIds])

  return { vaultIds, setVaultIds, addVault, removeVault, vaultInfoArray }
}
