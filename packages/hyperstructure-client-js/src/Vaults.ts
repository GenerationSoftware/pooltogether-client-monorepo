import { TokenWithAmount, TokenWithSupply, VaultInfo } from '@shared/types'
import {
  erc20 as erc20Abi,
  getTokenBalances,
  getTokenInfo,
  getVaultAddresses,
  getVaultBalances,
  getVaultExchangeRates,
  getVaultId,
  getVaultsByChainId,
  getVaultUnderlyingTokenAddresses,
  validateAddress,
  validateClientNetwork
} from '@shared/utilities'
import { getContract, PublicClient } from 'viem'
import { Vault } from './Vault'

/**
 * This class provides read-only functions to fetch onchain data from any vaults in vault list(s)
 */
export class Vaults {
  readonly vaults: { [vaultId: string]: Vault } = {}
  readonly chainIds: number[]
  readonly vaultAddresses: { [chainId: number]: `0x${string}`[] }
  underlyingTokenData: { [vaultId: string]: TokenWithSupply } | undefined
  underlyingTokenAddresses:
    | {
        byChain: { [chainId: number]: `0x${string}`[] }
        byVault: { [vaultId: string]: `0x${string}` }
      }
    | undefined

  /**
   * Creates an instance of a Vaults object with clients to query onchain data with
   * @param vaults a list of vaults
   * @param publicClients Public Viem clients for each network to create Vault objects for
   */
  constructor(
    public allVaultInfo: VaultInfo[],
    public publicClients: { [chainId: number]: PublicClient }
  ) {
    this.chainIds = Object.keys(publicClients)
      .map((key) => parseInt(key))
      .filter((chainId) => getVaultsByChainId(chainId, allVaultInfo).length > 0)
    this.vaultAddresses = getVaultAddresses(allVaultInfo)

    this.chainIds.forEach((chainId) => {
      const chainVaults = getVaultsByChainId(chainId, allVaultInfo)
      chainVaults.forEach((vault) => {
        const newVault = new Vault(vault.chainId, vault.address, publicClients[chainId], {
          decimals: vault.decimals,
          tokenAddress: vault.extensions?.underlyingAsset?.address,
          name: vault.name,
          logoURI: vault.logoURI,
          tokenLogoURI: vault.extensions?.underlyingAsset?.logoURI
        })
        this.vaults[newVault.id] = newVault
      })
    })
  }

  /* ============================== Read Functions ============================== */

  /**
   * Returns basic data about each vault's underlying asset
   * @returns
   */
  async getTokenData(): Promise<{ [vaultId: string]: TokenWithSupply }> {
    if (this.underlyingTokenData !== undefined) return this.underlyingTokenData

    const tokenData: { [vaultId: string]: TokenWithSupply } = {}

    const underlyingTokenAddresses = await this.getUnderlyingTokenAddresses()

    await Promise.all(
      this.chainIds.map((chainId) =>
        (async () => {
          const client = this.publicClients[chainId]
          if (!!client) {
            const source = `Vaults [getTokenData] [${chainId}]`
            await validateClientNetwork(chainId, client, source)
            const chainTokenData = await getTokenInfo(
              client,
              underlyingTokenAddresses.byChain[chainId]
            )
            const chainVaults = getVaultsByChainId(chainId, this.allVaultInfo)
            chainVaults.forEach((vault) => {
              const vaultId = getVaultId(vault)
              const tokenAddress = underlyingTokenAddresses.byVault[vaultId]
              tokenData[vaultId] = chainTokenData[tokenAddress]

              if (!!chainTokenData[tokenAddress]) {
                if (!isNaN(chainTokenData[tokenAddress].decimals)) {
                  this.vaults[vaultId].decimals = chainTokenData[tokenAddress].decimals
                }
                this.vaults[vaultId].tokenData = chainTokenData[tokenAddress]
              }
            })
          }
        })()
      )
    )

    this.underlyingTokenData = tokenData

    return this.underlyingTokenData
  }

  /**
   * Returns basic data about each vault's share token
   * @param chainIds optional chain IDs to query (by default queries all)
   * @returns
   */
  async getShareData(chainIds?: number[]): Promise<{ [vaultId: string]: TokenWithSupply }> {
    const shareData: { [vaultId: string]: TokenWithSupply } = {}
    const networksToQuery = chainIds ?? this.chainIds

    await Promise.all(
      networksToQuery.map((chainId) =>
        (async () => {
          const client = this.publicClients[chainId]
          if (!!client) {
            const source = `Vaults [getShareData] [${chainId}]`
            await validateClientNetwork(chainId, client, source)
            const chainShareData = await getTokenInfo(client, this.vaultAddresses[chainId])
            const chainVaults = getVaultsByChainId(chainId, this.allVaultInfo)
            chainVaults.forEach((vault) => {
              const vaultId = getVaultId(vault)
              shareData[vaultId] = chainShareData[vault.address]

              if (!!chainShareData[vault.address]) {
                if (!isNaN(chainShareData[vault.address].decimals)) {
                  this.vaults[vaultId].decimals = chainShareData[vault.address].decimals
                }
                this.vaults[vaultId].shareData = chainShareData[vault.address]

                if (this.vaults[vaultId].name === undefined) {
                  this.vaults[vaultId].name = chainShareData[vault.address].name
                }
              }
            })
          }
        })()
      )
    )

    return shareData
  }

  /**
   * Returns a user's balances for each vaults' underlying assets
   * @param userAddress the user's address to get balances for
   * @param chainIds optional chain IDs to query (by default queries all)
   * @returns
   */
  async getUserTokenBalances(
    userAddress: string,
    chainIds?: number[]
  ): Promise<{ [vaultId: string]: TokenWithAmount }> {
    const source = `Vaults [getUserTokenBalances]`
    const tokenBalances: { [vaultId: string]: TokenWithAmount } = {}
    const networksToQuery = chainIds ?? this.chainIds
    validateAddress(userAddress, source)

    const underlyingTokenAddresses = await this.getUnderlyingTokenAddresses()

    await Promise.all(
      networksToQuery.map((chainId) =>
        (async () => {
          const client = this.publicClients[chainId]
          if (!!client) {
            await validateClientNetwork(chainId, client, source + ` [${chainId}]`)
            const chainTokenBalances = await getTokenBalances(
              client,
              userAddress as `0x${string}`,
              underlyingTokenAddresses.byChain[chainId]
            )
            const chainVaults = getVaultsByChainId(chainId, this.allVaultInfo)
            chainVaults.forEach((vault) => {
              const vaultId = getVaultId(vault)
              const tokenAddress = underlyingTokenAddresses.byVault[vaultId]
              tokenBalances[vaultId] = chainTokenBalances[tokenAddress]
            })
          }
        })()
      )
    )

    return tokenBalances
  }

  /**
   * Returns a user's balances for each vaults' share tokens
   * @param userAddress the user's address to get balances for
   * @param chainIds optional chain IDs to query (by default queries all)
   * @returns
   */
  async getUserShareBalances(
    userAddress: string,
    chainIds?: number[]
  ): Promise<{ [vaultId: string]: TokenWithAmount }> {
    const source = `Vaults [getUserShareBalances]`
    const shareBalances: { [vaultId: string]: TokenWithAmount } = {}
    const networksToQuery = chainIds ?? this.chainIds
    validateAddress(userAddress, source)

    await Promise.all(
      networksToQuery.map((chainId) =>
        (async () => {
          const vaultAddresses = this.vaultAddresses[chainId]
          if (!!vaultAddresses) {
            const client = this.publicClients[chainId]
            if (!!client) {
              await validateClientNetwork(chainId, client, source + ` [${chainId}]`)
              const chainShareBalances = await getTokenBalances(
                client,
                userAddress as `0x${string}`,
                vaultAddresses
              )
              const chainVaults = getVaultsByChainId(chainId, this.allVaultInfo)
              chainVaults.forEach((vault) => {
                const vaultId = getVaultId(vault)
                shareBalances[vaultId] = chainShareBalances[vault.address]
              })
            }
          }
        })()
      )
    )

    return shareBalances
  }

  /**
   * Returns the total amount of underlying assets deposited in each vault
   * @param chainIds optional chain IDs to query (by default queries all)
   * @returns
   */
  async getTotalTokenBalances(
    chainIds?: number[]
  ): Promise<{ [vaultId: string]: TokenWithAmount }> {
    const tokenBalances: { [vaultId: string]: TokenWithAmount } = {}
    const networksToQuery = chainIds ?? this.chainIds

    const tokenData = await this.getTokenData()

    await Promise.all(
      networksToQuery.map((chainId) =>
        (async () => {
          const client = this.publicClients[chainId]
          if (!!client) {
            const source = `Vaults [getTotalTokenBalances] [${chainId}]`
            await validateClientNetwork(chainId, client, source)
            const chainVaults = getVaultsByChainId(chainId, this.allVaultInfo)
            const chainTokenBalances = await getVaultBalances(client, chainVaults)

            Object.keys(chainTokenBalances).forEach((vaultId) => {
              tokenBalances[vaultId] = {
                ...tokenData[vaultId],
                amount: chainTokenBalances[vaultId]
              }
            })
          }
        })()
      )
    )

    return tokenBalances
  }

  /**
   * Returns the exchange rate from 1 share to each vaults' underlying assets
   * @param chainIds optional chain IDs to query (by default queries all)
   * @returns
   */
  async getExchangeRates(chainIds?: number[]): Promise<{ [vaultId: string]: bigint }> {
    const exchangeRates: { [vaultId: string]: bigint } = {}
    const networksToQuery = chainIds ?? this.chainIds

    await Promise.all(
      networksToQuery.map((chainId) =>
        (async () => {
          const client = this.publicClients[chainId]
          if (!!client) {
            const source = `Vaults [getExchangeRates] [${chainId}]`
            await validateClientNetwork(chainId, client, source)
            const chainVaults = getVaultsByChainId(chainId, this.allVaultInfo)
            const chainExchangeRates = await getVaultExchangeRates(client, chainVaults)
            Object.assign(exchangeRates, chainExchangeRates)

            Object.keys(chainExchangeRates).forEach((vaultId) => {
              this.vaults[vaultId].exchangeRate = chainExchangeRates[vaultId]
            })
          }
        })()
      )
    )

    return exchangeRates
  }

  /**
   * Returns the unique underlying token addresses for all vaults
   * @returns
   */
  async getUnderlyingTokenAddresses(): Promise<{
    byChain: { [chainId: number]: `0x${string}`[] }
    byVault: { [vaultId: string]: `0x${string}` }
  }> {
    if (this.underlyingTokenAddresses !== undefined) return this.underlyingTokenAddresses

    const tokenAddresses: {
      byChain: { [chainId: number]: `0x${string}`[] }
      byVault: { [vaultId: string]: `0x${string}` }
    } = { byChain: {}, byVault: {} }

    await Promise.all(
      this.chainIds.map((chainId) =>
        (async () => {
          const client = this.publicClients[chainId]
          if (!!client) {
            const source = `Vaults [getUnderlyingTokenAddresses] [${chainId}]`
            await validateClientNetwork(chainId, client, source)
            const chainVaults = getVaultsByChainId(chainId, this.allVaultInfo)
            const chainTokenAddresses = await getVaultUnderlyingTokenAddresses(client, chainVaults)
            Object.assign(tokenAddresses.byVault, chainTokenAddresses)

            const uniqueTokenAddresses = Array.from(new Set(Object.values(chainTokenAddresses)))
            tokenAddresses.byChain[chainId] = uniqueTokenAddresses

            Object.keys(chainTokenAddresses).forEach((vaultId) => {
              const tokenAddress = chainTokenAddresses[vaultId]
              this.vaults[vaultId].tokenAddress = tokenAddress
              this.vaults[vaultId].tokenContract = getContract({
                address: tokenAddress,
                abi: erc20Abi,
                publicClient: client
              })
            })
          }
        })()
      )
    )

    this.underlyingTokenAddresses = tokenAddresses

    return this.underlyingTokenAddresses
  }
}
