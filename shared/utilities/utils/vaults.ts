import { VaultInfo } from '@shared/types'
import { Address, formatUnits, parseUnits, PublicClient } from 'viem'
import { twabControllerABI } from '../abis/twabController'
import { vaultABI } from '../abis/vault'
import { formatStringWithPrecision } from './formatting'
import {
  getComplexMulticallResults,
  getMulticallResults,
  getSimpleMulticallResults
} from './multicall'

/**
 * Returns a unique vault ID
 * @param vaultInfo basic vault info: chain ID and address
 * @returns
 */
export const getVaultId = (vaultInfo: VaultInfo | { chainId: number; address: string }) => {
  return `${vaultInfo.address.toLowerCase()}-${vaultInfo.chainId}`
}

/**
 * Returns vaults that match with a given chain ID
 * @param chainId the chain to filter vaults from
 * @param vaults vaults to filter
 * @returns
 */
export const getVaultsByChainId = (chainId: number, vaults: VaultInfo[]) => {
  return vaults.filter((vault) => vault.chainId === chainId)
}

/**
 * Returns an address's delegate balances for the provided vault addresses
 * @param publicClient a public Viem client for the chain that should be queried
 * @param userAddress the user's address to get balances for
 * @param vaultAddresses the vault addresses to query balances in
 * @param twabController the address of the TWAB controller to query through
 * @returns
 */
export const getVaultDelegateBalances = async (
  publicClient: PublicClient,
  userAddress: Address,
  vaultAddresses: Address[],
  twabController: Address
): Promise<{
  [vaultId: string]: bigint
}> => {
  const delegateBalances: { [vaultId: string]: bigint } = {}
  const chainId = await publicClient.getChainId()

  if (vaultAddresses.length > 0) {
    const calls = vaultAddresses.map((vaultAddress) => ({
      functionName: 'delegateBalanceOf',
      args: [vaultAddress, userAddress]
    }))

    const multicallResults = await getSimpleMulticallResults(
      publicClient,
      twabController,
      twabControllerABI,
      calls
    )

    vaultAddresses.forEach((vaultAddress, i) => {
      const result = multicallResults[i]
      const delegateBalance: bigint = typeof result === 'bigint' ? result : 0n
      const vaultId = getVaultId({ chainId, address: vaultAddress })
      delegateBalances[vaultId] = delegateBalance
    })
  }

  return delegateBalances
}

/**
 * Returns exchange rates to calculate shares to assets in each vault from a given chain
 * @param publicClient a public Viem client for the chain that should be queried
 * @param vaults vaults to query through
 * @returns
 */
export const getVaultExchangeRates = async (
  publicClient: PublicClient,
  vaults: VaultInfo[]
): Promise<{
  [vaultId: string]: bigint
}> => {
  const vaultExchangeRates: { [vaultId: string]: bigint } = {}
  const chainId = await publicClient.getChainId()
  const filteredVaults = !!chainId
    ? vaults.filter((vault) => vault.chainId === chainId && vault.decimals !== undefined)
    : []

  if (filteredVaults.length > 0) {
    const calls = filteredVaults.map((vault) => ({
      address: vault.address,
      abi: vaultABI,
      functionName: 'convertToAssets',
      args: [parseUnits('1', vault.decimals as number)]
    }))

    const multicallResults = await getComplexMulticallResults(publicClient, calls)

    filteredVaults.forEach((vault) => {
      const vaultId = getVaultId(vault)
      vaultExchangeRates[vaultId] = multicallResults[vault.address]?.['convertToAssets'] ?? 0n
    })
  }

  return vaultExchangeRates
}

/**
 * Returns an asset amount based on shares and a vault exchange rate
 * @param shares the share amount to convert to assets
 * @param exchangeRate the vault's exchange rate (unformatted BigInt)
 * @param decimals the vault's number of decimals
 * @returns
 */
export const getAssetsFromShares = (shares: bigint, exchangeRate: bigint, decimals: number) => {
  const result = BigInt(formatStringWithPrecision(formatUnits(shares * exchangeRate, decimals), 0))
  return result
}

/**
 * Returns a share amount based on assets and a vault exchange rate
 * @param assets the asset amount to convert to shares
 * @param exchangeRate the vault's exchange rate (unformatted BigInt)
 * @param decimals the vault's number of decimals
 * @returns
 */
export const getSharesFromAssets = (assets: bigint, exchangeRate: bigint, decimals: number) => {
  const result = (assets * parseUnits('1', decimals)) / exchangeRate
  return result
}

/**
 * Returns the total underlying token amount deposited in each vault from a given chain
 * @param publicClient a public Viem client for the chain that should be queried
 * @param vaults vaults to query through
 * @returns
 */
export const getVaultBalances = async (
  publicClient: PublicClient,
  vaults: VaultInfo[]
): Promise<{
  [vaultId: string]: bigint
}> => {
  const vaultBalances: { [vaultId: string]: bigint } = {}
  const chainId = await publicClient.getChainId()
  const filteredVaults = !!chainId ? vaults.filter((vault) => vault.chainId === chainId) : []

  if (filteredVaults.length > 0) {
    const vaultAddresses = filteredVaults.map((vault) => vault.address)
    const multicallResults = await getMulticallResults(publicClient, vaultAddresses, vaultABI, [
      { functionName: 'totalAssets' }
    ])

    filteredVaults.forEach((vault) => {
      const vaultId = getVaultId(vault)
      vaultBalances[vaultId] = multicallResults[vault.address]?.['totalAssets'] ?? 0n
    })
  }

  return vaultBalances
}

/**
 * Returns the vault addresses from all vaults given
 * @param vaults vaults' info
 * @returns
 */
export const getVaultAddresses = (vaults: VaultInfo[]): { [chainId: number]: Address[] } => {
  const vaultAddresses: { [chainId: number]: Address[] } = {}

  vaults.forEach((vault) => {
    if (vaultAddresses[vault.chainId] === undefined) {
      vaultAddresses[vault.chainId] = []
    }
    if (!vaultAddresses[vault.chainId].includes(vault.address)) {
      vaultAddresses[vault.chainId].push(vault.address)
    }
  })

  return vaultAddresses
}

/**
 * Returns the underlying token addresses for each vault from a given chain
 * @param publicClient a public Viem client for the chain that should be queried
 * @param vaults vaults' info
 * @returns
 */
export const getVaultUnderlyingTokenAddresses = async (
  publicClient: PublicClient,
  vaults: VaultInfo[]
): Promise<{ [vaultId: string]: Address }> => {
  const tokenAddresses: { [vaultId: string]: Address } = {}

  const chainId = await publicClient.getChainId()
  const filteredVaults = !!chainId ? vaults.filter((vault) => vault.chainId === chainId) : []

  if (filteredVaults.length > 0) {
    const vaultAddresses = new Set<Address>()
    filteredVaults.forEach((vault) => {
      if (!!vault.extensions?.underlyingAsset?.address) {
        const vaultId = getVaultId(vault)
        tokenAddresses[vaultId] = vault.extensions.underlyingAsset.address
      } else {
        vaultAddresses.add(vault.address)
      }
    })

    if (vaultAddresses.size > 0) {
      const multicallResults = await getMulticallResults(
        publicClient,
        Array.from(vaultAddresses),
        vaultABI,
        [{ functionName: 'asset' }]
      )

      vaultAddresses.forEach((address) => {
        const vaultId = getVaultId({ chainId, address })
        tokenAddresses[vaultId] = multicallResults[address]?.['asset']
      })
    }
  }

  return tokenAddresses
}
