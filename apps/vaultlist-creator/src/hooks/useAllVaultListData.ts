import {
  useAllVaultShareData,
  useAllVaultTokenData,
  useVaults
} from '@pooltogether/hyperstructure-react-hooks'
import { getVaultId } from '@shared/utilities'
import { useAtomValue } from 'jotai'
import { listImageAtom, listKeywordsAtom, listNameAtom, vaultsAtom } from 'src/atoms'

/**
 * Returns all data to build a VaultList
 * @returns
 */
export const useAllVaultListData = () => {
  const name = useAtomValue(listNameAtom)

  const keywordsSet = useAtomValue(listKeywordsAtom)
  const keywords = Array.from(keywordsSet)

  const logoURI = useAtomValue(listImageAtom)

  const vaultInfo = useAtomValue(vaultsAtom)

  const vaults = useVaults(vaultInfo, { useAllChains: true })

  const { data: shareData, isFetched: isFetchedAllShareData } = useAllVaultShareData(vaults)
  const { data: tokenData, isFetched: isFetchedAllTokenData } = useAllVaultTokenData(vaults)

  const isFetched = isFetchedAllShareData && isFetchedAllTokenData

  const filteredVaultInfo = isFetched
    ? vaultInfo.filter((vault) => {
        const vaultId = getVaultId(vault)
        const data = shareData?.[vaultId]

        return !!data && !isNaN(data.decimals) && !!data.symbol
      })
    : []

  return {
    name,
    keywords,
    logoURI,
    vaultInfo,
    filteredVaultInfo,
    vaults,
    shareData,
    tokenData,
    isFetched
  }
}
