import {
  useAllUserVaultBalances,
  useAllVaultSharePrices,
  useBeefyVault,
  useCachedVaultLists,
  useSelectedVault,
  useTokenBalance,
  useTokenBalances,
  useTokenPrices,
  useTokens,
  useVaults
} from '@generationsoftware/hyperstructure-react-hooks'
import { TokenWithAmount, TokenWithLogo, TokenWithPrice } from '@shared/types'
import { DOLPHIN_ADDRESS, getVaultId, lower } from '@shared/utilities'
import { useMemo } from 'react'
import { formatUnits } from 'viem'
import { useAccount } from 'wagmi'
import { ZAP_TOKEN_OPTIONS } from '@constants/config'

/**
 * Returns token options to use for zap transactions
 * @param chainId the chain ID the zap is to be made in
 * @param options optional settings
 * @returns
 */
export const useZapTokenOptions = (
  chainId: number,
  options?: {
    includeNativeAsset?: boolean
    includeVaultsWithBalance?: boolean
    includeBeefyVault?: boolean
  }
) => {
  const { address: userAddress } = useAccount()

  const tokenAddresses = ZAP_TOKEN_OPTIONS[chainId] ?? []

  const { data: tokens } = useTokens(chainId, tokenAddresses)
  const { data: tokenBalances } = useTokenBalances(chainId, userAddress!, tokenAddresses, {
    refetchOnWindowFocus: true
  })
  const { data: tokenPrices } = useTokenPrices(chainId, tokenAddresses)

  const { vault } = useSelectedVault()

  const { cachedVaultLists } = useCachedVaultLists()
  const vaults = useVaults(
    Object.values(cachedVaultLists)
      .map((list) => list?.tokens ?? [])
      .flat()
      .filter((t) => t.chainId === chainId)
  )
  const { data: vaultBalances } = useAllUserVaultBalances(vaults, userAddress!, {
    refetchOnWindowFocus: true
  })
  const { data: sharePrices } = useAllVaultSharePrices(vaults)

  const { data: beefyVault } = useBeefyVault(vault!, {
    enabled: options?.includeBeefyVault ?? false
  })
  const { data: beefyVaultBalance } = useTokenBalance(
    chainId,
    userAddress!,
    (!!beefyVault ? beefyVault.address : undefined)!,
    { refetchOnWindowFocus: true }
  )
  const { data: underlyingBeefyTokenPrices } = useTokenPrices(
    chainId,
    !!beefyVault ? [beefyVault.want] : []
  )

  const tokenOptions = useMemo(() => {
    const tOptions: (TokenWithAmount &
      Required<TokenWithPrice> &
      Partial<TokenWithLogo> & { value: number })[] = []

    if (!!tokens) {
      Object.values(tokens).forEach((token) => {
        if (options?.includeNativeAsset || lower(token.address) !== DOLPHIN_ADDRESS) {
          const amount = tokenBalances?.[token.address]?.amount ?? 0n
          const price = tokenPrices?.[lower(token.address)] ?? 0
          const value = parseFloat(formatUnits(amount, token.decimals)) * price

          tOptions.push({ ...token, amount, price, value })
        }
      })
    }

    if (options?.includeVaultsWithBalance && !!vault && !!vaultBalances) {
      Object.values(vaultBalances)
        .filter(
          (v) => v.chainId === chainId && !!v.amount && lower(v.address) !== lower(vault.address)
        )
        .forEach((share) => {
          const vaultId = getVaultId(share)
          const price = sharePrices?.[vaultId]?.price ?? 0
          const value = parseFloat(formatUnits(share.amount, share.decimals)) * price

          tOptions.push({ ...share, price, value })
        })
    }

    if (options?.includeBeefyVault && !!beefyVault && !!beefyVaultBalance) {
      const underlyingPrice = underlyingBeefyTokenPrices?.[lower(beefyVault.want)] ?? 0
      const price = underlyingPrice * parseFloat(formatUnits(beefyVault.pricePerFullShare, 18))
      const value =
        parseFloat(formatUnits(beefyVaultBalance.amount, beefyVaultBalance.decimals)) * price

      tOptions.push({ ...beefyVaultBalance, logoURI: beefyVault.logoURI, price, value })
    }

    return tOptions.sort((a, b) => b.value - a.value)
  }, [
    tokens,
    tokenBalances,
    tokenPrices,
    vault,
    vaultBalances,
    sharePrices,
    beefyVault,
    beefyVaultBalance,
    underlyingBeefyTokenPrices,
    options
  ])

  return tokenOptions
}
