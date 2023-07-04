import {
  useAllVaultShareData,
  useAllVaultTokenData,
  useVaults
} from '@pooltogether/hyperstructure-react-hooks'
import { useAtomValue } from 'jotai'
import { listKeywordsAtom, listNameAtom, vaultsAtom } from 'src/atoms'
import { getFormattedVaultList } from 'src/utils'

// TODO: include token logos from coingecko
/**
 * Returns a formatted VaultList
 * @returns
 */
export const useNewVaultList = () => {
  const vaultListName = useAtomValue(listNameAtom)
  const vaultListKeywords = useAtomValue(listKeywordsAtom)
  const vaultInfo = useAtomValue(vaultsAtom)

  const vaults = useVaults(vaultInfo, { useAllChains: true })

  const { data: allShareData, isFetched: isFetchedAllShareData } = useAllVaultShareData(vaults)
  const { data: allTokenData, isFetched: isFetchedAllTokenData } = useAllVaultTokenData(vaults)

  const isFetched =
    isFetchedAllShareData && isFetchedAllTokenData && !!allShareData && !!allTokenData

  if (!isFetched) {
    return { isFetched: false }
  }

  const vaultList = getFormattedVaultList({
    name: vaultListName,
    tokens: vaultInfo,
    keywords: Array.from(vaultListKeywords),
    shareData: allShareData,
    tokenData: allTokenData
  })

  return { vaultList, isFetched }
}
