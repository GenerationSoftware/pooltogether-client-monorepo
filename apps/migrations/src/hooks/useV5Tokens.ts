import { NO_REFETCH } from '@shared/generic-react-hooks'
import { TokenWithLogo, VaultInfo } from '@shared/types'
import { DOMAINS } from '@shared/ui'
import { getVaultList } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { SUPPORTED_NETWORKS } from '@constants/config'

export const useV5Tokens = () => {
  const { data: cabanaVaultList, isFetched: isFetchedCabanaVaultList } = useQuery({
    queryKey: ['cabanaVaultList'],
    queryFn: async () => {
      return await getVaultList(`${DOMAINS.app}/api/vaultList/default`)
    },
    ...NO_REFETCH
  })

  const data = useMemo(() => {
    const tokens: TokenWithLogo[] = []

    if (isFetchedCabanaVaultList && !!cabanaVaultList) {
      cabanaVaultList.tokens.forEach((token) => {
        isValidToken(token) && tokens.push(token)
      })
    }

    return tokens
  }, [cabanaVaultList, isFetchedCabanaVaultList])

  const isFetched = isFetchedCabanaVaultList

  return { data, isFetched }
}

const isValidToken = (vaultInfo: VaultInfo): vaultInfo is TokenWithLogo => {
  return (
    SUPPORTED_NETWORKS.includes(vaultInfo.chainId) &&
    !!vaultInfo.symbol &&
    !!vaultInfo.name &&
    vaultInfo.decimals !== undefined &&
    !!vaultInfo.logoURI &&
    !vaultInfo.tags?.includes('deprecated')
  )
}
