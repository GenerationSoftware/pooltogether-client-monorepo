import { getVaultId, VaultInfo, VaultList, Vaults } from '@pooltogether/hyperstructure-client-js'
import { atom, useAtom } from 'jotai'
import {
  useAllVaultShareData,
  useAllVaultTokenAddresses,
  useAllVaultTokenData,
  usePublicClientsByChain,
  useSelectedVaultLists
} from '..'

/**
 * Returns an instance of a `Vaults` class with only selected vault lists' vaults
 *
 * NOTE: Also queries share data, token data and underlying token addresses for each vault
 * @returns
 */
export const useSelectedVaults = (): { vaults: Vaults; isFetched: boolean } => {
  const publicClients = usePublicClientsByChain()

  const { localVaultLists, importedVaultLists } = useSelectedVaultLists()

  const selectedVaultIds = new Set<string>()
  const selectedVaultInfo: VaultInfo[] = []

  const addTokens = (vaultList: VaultList) => {
    vaultList.tokens.forEach((vaultInfo) => {
      const vaultId = getVaultId(vaultInfo)
      if (!selectedVaultIds.has(vaultId)) {
        selectedVaultIds.add(vaultId)
        selectedVaultInfo.push(vaultInfo)
      }
    })
  }

  Object.values(localVaultLists).forEach((localVaultList) => {
    addTokens(localVaultList)
  })

  Object.values(importedVaultLists).forEach((importedVaultList) => {
    addTokens(importedVaultList)
  })

  // TODO: ideally if we return the same cached/memoized instance of `Vaults` we can avoid re-assigning data
  const vaults = new Vaults(selectedVaultInfo, publicClients)

  const { data: shareData, isFetched: isFetchedShareData } = useAllVaultShareData(vaults)
  const { data: tokenData, isFetched: isFetchedTokenData } = useAllVaultTokenData(vaults)
  const { data: tokenAddresses, isFetched: isFetchedTokenAddresses } =
    useAllVaultTokenAddresses(vaults)

  if (!!shareData) {
    Object.keys(shareData).forEach((vaultId) => {
      if (vaults.vaults[vaultId].decimals === undefined && !isNaN(shareData[vaultId].decimals)) {
        vaults.vaults[vaultId].decimals = shareData[vaultId].decimals
      }
      vaults.vaults[vaultId].shareData = shareData[vaultId]
      if (vaults.vaults[vaultId].name === undefined) {
        vaults.vaults[vaultId].name = shareData[vaultId].name
      }
    })
  }

  if (!!tokenData) {
    Object.keys(tokenData).forEach((vaultId) => {
      if (vaults.vaults[vaultId].decimals === undefined && !isNaN(tokenData[vaultId].decimals)) {
        vaults.vaults[vaultId].decimals = tokenData[vaultId].decimals
      }
      vaults.vaults[vaultId].tokenData = tokenData[vaultId]
    })
  }

  if (!!tokenAddresses) {
    vaults.underlyingTokenAddresses = tokenAddresses
  }

  const isFetched = isFetchedShareData && isFetchedTokenData && isFetchedTokenAddresses

  return { vaults, isFetched }
}

const selectedVaultIdAtom = atom<string>(undefined as unknown as string)

/**
 * Returns the currently selected `Vault` as well as a function to change this selection
 *
 * Wraps {@link useSelectedVaults}
 *
 * NOTE: `vault` is initially `undefined`.
 * @returns
 */
export const useSelectedVault = () => {
  const { vaults } = useSelectedVaults()

  const [selectedVaultId, setSelectedVaultId] = useAtom(selectedVaultIdAtom)

  const vault = selectedVaultId !== undefined ? vaults.vaults[selectedVaultId] : undefined

  return { vault, setSelectedVaultById: setSelectedVaultId }
}
