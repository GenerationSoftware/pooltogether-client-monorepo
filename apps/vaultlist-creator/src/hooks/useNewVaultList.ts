import { getFormattedVaultList } from '@shared/utilities'
import { useAllVaultListData } from './useAllVaultListData'

/**
 * Returns a formatted VaultList
 * @returns
 */
export const useNewVaultList = () => {
  const { name, version, keywords, logoURI, filteredVaultInfo, shareData, tokenData, isFetched } =
    useAllVaultListData()

  if (!isFetched || !shareData || !tokenData) {
    return { isFetched: false }
  }

  const vaultList = getFormattedVaultList({
    name,
    version,
    tokens: filteredVaultInfo,
    keywords,
    logoURI,
    shareData,
    tokenData
  })

  return { vaultList, isFetched }
}
