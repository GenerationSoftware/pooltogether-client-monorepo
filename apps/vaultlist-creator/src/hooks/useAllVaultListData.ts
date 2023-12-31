import { Vaults } from '@generationsoftware/hyperstructure-client-js'
import {
  useAllVaultShareData,
  useAllVaultTokenData,
  useVaults
} from '@generationsoftware/hyperstructure-react-hooks'
import { TokenWithSupply, VaultInfo, Version } from '@shared/types'
import { getVaultId } from '@shared/utilities'
import { useAtomValue } from 'jotai'
import {
  listImageAtom,
  listKeywordsAtom,
  listNameAtom,
  listVersionAtom,
  vaultsAtom
} from 'src/atoms'

/**
 * Returns all data to build a VaultList
 * @returns
 */
export const useAllVaultListData = (): {
  name: string
  version: Version
  keywords: string[]
  logoURI: string
  vaultInfo: VaultInfo[]
  filteredVaultInfo: VaultInfo[]
  vaults: Vaults
  shareData?: { [vaultId: string]: TokenWithSupply }
  tokenData?: { [vaultId: string]: TokenWithSupply }
  isFetched: boolean
} => {
  const name = useAtomValue(listNameAtom)

  const version = useAtomValue(listVersionAtom)

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
    version,
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
