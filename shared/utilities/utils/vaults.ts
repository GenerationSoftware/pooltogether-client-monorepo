import { VaultInfo } from '@shared/types'
import { Address, formatUnits, isAddress, parseUnits, PublicClient } from 'viem'
import { twabControllerABI } from '../abis/twabController'
import { vaultABI } from '../abis/vault'
import { vaultFactoryABI } from '../abis/vaultFactory'
import { VAULT_FACTORY_ADDRESSES } from '../constants'
import { lower } from './addresses'
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
 * Returns an address's delegates for the provided vault addresses
 * @param publicClient a public Viem client for the chain that should be queried
 * @param userAddress the user's address to get delegates for
 * @param vaultAddresses the vault addresses to check delegates for
 * @param twabController the address of the TWAB controller to query through
 * @returns
 */
export const getVaultDelegates = async (
  publicClient: PublicClient,
  userAddress: Address,
  vaultAddresses: Address[],
  twabController: Address
): Promise<{ [vaultId: string]: Address }> => {
  const delegates: { [vaultId: string]: Address } = {}
  const chainId = await publicClient.getChainId()

  if (vaultAddresses.length > 0) {
    const calls = vaultAddresses.map((vaultAddress) => ({
      functionName: 'delegateOf',
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
      const delegate = typeof result === 'string' && isAddress(result) ? result : userAddress
      const vaultId = getVaultId({ chainId, address: vaultAddress })
      delegates[vaultId] = delegate
    })
  }

  return delegates
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
      { functionName: 'totalPreciseAssets' },
      { functionName: 'totalAssets' }
    ])

    filteredVaults.forEach((vault) => {
      const vaultId = getVaultId(vault)
      vaultBalances[vaultId] =
        multicallResults[vault.address]?.['totalPreciseAssets'] ??
        multicallResults[vault.address]?.['totalAssets'] ??
        0n
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
 * Returns all vault addresses from a vault factory
 * @param publicClient a public Viem client to query through
 * @param options optional custom vault factory address
 * @returns
 */
export const getVaultAddressesFromFactory = async (
  publicClient: PublicClient,
  options?: { factoryAddress?: Address }
) => {
  const vaultAddresses = new Set<Lowercase<Address>>()

  const chainId = await publicClient.getChainId()

  const vaultFactoryAddress = options?.factoryAddress ?? VAULT_FACTORY_ADDRESSES[chainId]

  if (!vaultFactoryAddress) throw new Error(`No vault factory address set for chain ID ${chainId}`)

  const totalVaults = await publicClient.readContract({
    address: vaultFactoryAddress,
    abi: vaultFactoryABI,
    functionName: 'totalVaults'
  })

  const vaultIndexes = [...Array(Number(totalVaults)).keys()]
  const calls = vaultIndexes.map((vaultIndex) => ({
    functionName: 'allVaults',
    args: [vaultIndex]
  }))

  const multicallResults: (string | undefined)[] = await getSimpleMulticallResults(
    publicClient,
    vaultFactoryAddress,
    vaultFactoryABI,
    calls
  )

  multicallResults.forEach((address) => {
    if (!!address && isAddress(address)) {
      vaultAddresses.add(lower(address))
    }
  })

  return [...vaultAddresses]
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
