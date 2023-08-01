import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { vaultAddressesAtom } from 'src/atoms'
import { Address } from 'viem'
import { LOCAL_STORAGE_KEYS } from '@constants/config'

/**
 * Returns a record of a user's deployed vaults and methods to update them
 */
export const useDeployedVaults = () => {
  const [vaultAddresses, _setVaultAddresses] = useAtom(vaultAddressesAtom)

  const setVaultAddresses = (newVaultAddresses: Address[]) => {
    _setVaultAddresses(newVaultAddresses.map((address) => address.toLowerCase() as Address))
  }

  const addVaultAddress = (newVaultAddress: Address) => {
    _setVaultAddresses((prev) =>
      Array.from(new Set<Address>([...prev, newVaultAddress.toLowerCase() as Address]))
    )
  }

  const removeVaultAddress = (oldVaultAddress: Address) => {
    _setVaultAddresses((prev) => prev.filter((v) => v !== oldVaultAddress.toLowerCase()))
  }

  useEffect(
    () => localStorage.setItem(LOCAL_STORAGE_KEYS.vaultAddresses, vaultAddresses.join(',')),
    [vaultAddresses]
  )

  return { vaultAddresses, setVaultAddresses, addVaultAddress, removeVaultAddress }
}
