import { useAllUserVaultBalances, useVaults } from '@generationsoftware/hyperstructure-react-hooks'
import { TokenWithAmount, VaultInfo } from '@shared/types'
import { useMemo } from 'react'
import { Address } from 'viem'
import { OLD_V5_VAULTS, SUPPORTED_NETWORKS, SupportedNetwork, V5_TAG } from '@constants/config'

export interface V5BalanceToMigrate {
  token: TokenWithAmount
  vaultInfo: VaultInfo & { tags?: V5_TAG[] }
  destination: { chainId: SupportedNetwork; address: Lowercase<Address> }
}

export const useUserV5Balances = (
  userAddress: Address
): {
  data: V5BalanceToMigrate[]
  isFetched: boolean
  refetch: () => void
} => {
  const allVaultInfo = useMemo(() => {
    const info: VaultInfo[] = []

    SUPPORTED_NETWORKS.forEach((network) => {
      const vaultInfoArray = OLD_V5_VAULTS[network]?.map((entry) => entry.vault) ?? []
      info.push(...vaultInfoArray)
    })

    return info
  }, [])

  const vaults = useVaults(allVaultInfo)

  const { data: vaultBalances, isFetched, refetch } = useAllUserVaultBalances(vaults, userAddress)

  const data = useMemo(() => {
    const balancesToMigrate: V5BalanceToMigrate[] = []

    if (isFetched && !!vaultBalances) {
      SUPPORTED_NETWORKS.forEach((network) => {
        Object.values(vaultBalances).forEach((token) => {
          if (!!token.amount) {
            const data = OLD_V5_VAULTS[network]?.find(
              (entry) => entry.vault.address.toLowerCase() === token.address.toLowerCase()
            )

            if (!!data) {
              balancesToMigrate.push({ token, vaultInfo: data.vault, destination: data.migrateTo })
            }
          }
        })
      })
    }

    return balancesToMigrate
  }, [vaultBalances, isFetched])

  return { data, isFetched, refetch }
}
