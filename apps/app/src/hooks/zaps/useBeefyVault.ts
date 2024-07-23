import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useVaultTokenAddress,
  useVaultYieldSource
} from '@generationsoftware/hyperstructure-react-hooks'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { TokenWithLogo } from '@shared/types'
import { erc20ABI, getSimpleMulticallResults, lower } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { Address } from 'viem'
import { usePublicClient } from 'wagmi'

/**
 * Returns basic data of a vault's underlying beefy mooToken (if any)
 * @param vault the vault to check
 * @param options optional settings
 * @returns
 */
export const useBeefyVault = (vault: Vault, options?: { enabled?: boolean }) => {
  const publicClient = usePublicClient({ chainId: vault?.chainId })

  const { data: yieldVault } = useVaultYieldSource(vault)
  const { data: vaultTokenAddress } = useVaultTokenAddress(vault)

  return useQuery({
    queryKey: ['beefyVault', vault?.id],
    queryFn: async () => {
      if (!!publicClient && !!yieldVault && !!vaultTokenAddress) {
        try {
          const mooTokenAddress = await publicClient.readContract({
            address: yieldVault,
            abi: [
              {
                inputs: [],
                name: 'vault',
                outputs: [{ internalType: 'address', name: '', type: 'address' }],
                stateMutability: 'view',
                type: 'function'
              }
            ],
            functionName: 'vault'
          })

          const multicallResults = await getSimpleMulticallResults(
            publicClient,
            mooTokenAddress,
            [
              ...erc20ABI,
              {
                inputs: [],
                name: 'want',
                outputs: [
                  { internalType: 'contract IERC20Upgradeable', name: '', type: 'address' }
                ],
                stateMutability: 'view',
                type: 'function'
              },
              {
                inputs: [],
                name: 'getPricePerFullShare',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function'
              }
            ],
            [
              { functionName: 'decimals' },
              { functionName: 'name' },
              { functionName: 'symbol' },
              { functionName: 'want' },
              { functionName: 'getPricePerFullShare' }
            ]
          )

          const decimals: number = multicallResults[0]
          const name: string = multicallResults[1]
          const symbol: string = multicallResults[2]
          const want: Address | undefined = multicallResults[3]
          const pricePerFullShare: bigint = multicallResults[4]

          if (
            !!symbol &&
            symbol.startsWith('moo') &&
            !!want &&
            lower(want) === lower(vaultTokenAddress)
          ) {
            const mooTokenInfo: TokenWithLogo & { want: Address; pricePerFullShare: bigint } = {
              chainId: vault.chainId,
              address: mooTokenAddress,
              decimals,
              name,
              symbol,
              logoURI: 'https://assets.coingecko.com/coins/images/12704/standard/bifi.png',
              want,
              pricePerFullShare
            }

            return mooTokenInfo
          }

          return false
        } catch {
          return false
        }
      }
    },
    enabled:
      !!vault &&
      !!publicClient &&
      !!yieldVault &&
      !!vaultTokenAddress &&
      options?.enabled !== false,
    ...NO_REFETCH
  })
}
