import {
  useAllUserVaultBalances,
  useAllVaultSharePrices,
  useCachedVaultLists,
  useSelectedVault,
  useTokenBalance,
  useTokenBalances,
  useTokenPrices,
  useTokens,
  useVaults
} from '@generationsoftware/hyperstructure-react-hooks'
import { TokenWithAmount, TokenWithLogo, TokenWithPrice } from '@shared/types'
import { DOLPHIN_ADDRESS, getVaultId, lower, NETWORK } from '@shared/utilities'
import { useMemo } from 'react'
import { isDolphinAddress } from 'src/zapUtils'
import { Address, formatUnits } from 'viem'
import { useAccount } from 'wagmi'
import { useBeefyVault } from './useBeefyVault'

// TODO: should not hardcode token options (fetch from some existing tokenlist - paraswap would be ideal)
const zapTokenOptions: { [chainId: number]: Address[] } = {
  [NETWORK.optimism]: [
    DOLPHIN_ADDRESS, // ETH
    '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85', // USDC
    '0x4200000000000000000000000000000000000006', // WETH
    '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', // DAI
    '0x395Ae52bB17aef68C2888d941736A71dC6d4e125', // POOL
    '0xc40F949F8a4e094D1b49a23ea9241D289B7b2819', // LUSD
    '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58', // USDT
    '0x7F5c764cBc14f9669B88837ca1490cCa17c31607', // USDC.e
    '0x4200000000000000000000000000000000000042', // OP
    '0x1F32b1c2345538c0c6f582fCB022739c4A194Ebb', // wstETH
    '0xc55e93c62874d8100dbd2dfe307edc1036ad5434' // mooBIFI
  ],
  [NETWORK.base]: [
    DOLPHIN_ADDRESS, // ETH
    '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC
    '0x940181a94A35A4569E4529A3CDfB74e38FD98631', // AERO
    '0xd652C5425aea2Afd5fb142e120FeCf79e18fafc3', // POOL
    '0x4200000000000000000000000000000000000006', // WETH
    '0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452', // wstETH
    '0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22', // cbETH
    '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb', // DAI
    '0x368181499736d0c0CC614DBB145E2EC1AC86b8c6', // LUSD
    '0x0000206329b97DB379d5E1Bf586BbDB969C63274', // USDA
    '0xA88594D404727625A9437C3f886C7643872296AE' // WELL
  ],
  [NETWORK.arbitrum]: [
    DOLPHIN_ADDRESS, // ETH
    '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', // USDC
    '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', // WETH
    '0xCF934E2402A5e072928a39a956964eb8F2B5B79C', // POOL
    '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', // USDT
    '0x0000206329b97DB379d5E1Bf586BbDB969C63274', // USDA
    '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8', // USDC.e
    '0x912CE59144191C1204E64559FE8253a0e49E6548' // ARB
  ]
}

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

  const tokenAddresses = zapTokenOptions[chainId] ?? []

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
        if (options?.includeNativeAsset || !isDolphinAddress(token.address)) {
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
