import { getFormattedVaultList } from 'src/utils'
import { useAllVaultListData } from './useAllVaultListData'

/**
 * Returns a formatted VaultList
 * @returns
 */
export const useNewVaultList = () => {
  const { name, keywords, filteredVaultInfo, shareData, tokenData, isFetched } =
    useAllVaultListData()

  if (!isFetched || !shareData || !tokenData) {
    return { isFetched: false }
  }

  const vaultList = getFormattedVaultList({
    name,
    tokens: filteredVaultInfo,
    keywords,
    shareData,
    tokenData
  })

  return { vaultList, isFetched }
}
