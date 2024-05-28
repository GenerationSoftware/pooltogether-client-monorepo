import { TokenWithAmount, TokenWithSupply, VaultInfo } from '@shared/types'
import {
  getTokenBalances,
  getTokenInfo,
  getVaultAddresses,
  getVaultBalances,
  getVaultDelegateBalances,
  getVaultDelegates,
  getVaultExchangeRates,
  getVaultId,
  getVaultsByChainId,
  getVaultUnderlyingTokenAddresses,
  validateAddress,
  validateClientNetwork
} from '@shared/utilities'
import { Address, PublicClient } from 'viem'
import { Vault } from './Vault'

/**
 * This class provides read-only functions to fetch onchain data from any vaults in vault list(s)
 */
export class Vaults {
  readonly vaults: { [vaultId: string]: Vault } = {}
  readonly chainIds: number[]
  readonly vaultAddresses: { [chainId: number]: Address[] }
  underlyingTokenData: { [vaultId: string]: TokenWithSupply } | undefined
  underlyingTokenAddresses:
    | {
        byChain: { [chainId: number]: Address[] }
        byVault: { [vaultId: string]: Address }
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
          tags: vault.tags,
          tokenLogoURI: vault.extensions?.underlyingAsset?.logoURI,
          yieldSourceName: vault.extensions?.yieldSource?.name,
          yieldSourceURI: vault.extensions?.yieldSource?.appURI
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

    await Promise.allSettled(
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

    await Promise.allSettled(
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

    await Promise.allSettled(
      networksToQuery.map((chainId) =>
        (async () => {
          const client = this.publicClients[chainId]
          if (!!client) {
            await validateClientNetwork(chainId, client, source + ` [${chainId}]`)
            const chainTokenBalances = await getTokenBalances(
              client,
              userAddress as Address,
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

    await Promise.allSettled(
      networksToQuery.map((chainId) =>
        (async () => {
          const vaultAddresses = this.vaultAddresses[chainId]
          if (!!vaultAddresses) {
            const client = this.publicClients[chainId]
            if (!!client) {
              await validateClientNetwork(chainId, client, source + ` [${chainId}]`)
              const chainShareBalances = await getTokenBalances(
                client,
                userAddress as Address,
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

    await Promise.allSettled(
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
   * Returns a user's delegate balances for each vaults' share tokens
   * @param userAddress the user's address to get balances for
   * @param chainIds optional chain IDs to query (by default queries all)
   * @returns
   */
  async getUserDelegateBalances(
    userAddress: string,
    chainIds?: number[]
  ): Promise<{ [vaultId: string]: bigint }> {
    const source = `Vaults [getUserDelegateBalances]`
    const delegateBalances: { [vaultId: string]: bigint } = {}
    const networksToQuery = chainIds ?? this.chainIds
    validateAddress(userAddress, source)

    await Promise.allSettled(
      networksToQuery.map((chainId) =>
        (async () => {
          const vaultAddresses = this.vaultAddresses[chainId]
          if (!!vaultAddresses?.length) {
            const client = this.publicClients[chainId]
            if (!!client) {
              await validateClientNetwork(chainId, client, source + ` [${chainId}]`)
              const twabControllerAddress = await this.vaults[
                getVaultId({ chainId, address: vaultAddresses[0] })
              ].getTWABController()
              const chainDelegateBalances = await getVaultDelegateBalances(
                client,
                userAddress as Address,
                vaultAddresses,
                twabControllerAddress
              )
              for (const vaultId in chainDelegateBalances) {
                delegateBalances[vaultId] = chainDelegateBalances[vaultId]
              }
            }
          }
        })()
      )
    )

    return delegateBalances
  }

  /**
   * Returns a user's delegates for each vault
   * @param userAddress the user's address to get delegates for
   * @param chainIds optional chain IDs to query (by default queries all)
   * @returns
   */
  async getUserDelegates(
    userAddress: string,
    chainIds?: number[]
  ): Promise<{ [vaultId: string]: Address }> {
    const source = `Vaults [getUserDelegates]`
    const delegates: { [vaultId: string]: Address } = {}
    const networksToQuery = chainIds ?? this.chainIds
    validateAddress(userAddress, source)

    await Promise.allSettled(
      networksToQuery.map((chainId) =>
        (async () => {
          const vaultAddresses = this.vaultAddresses[chainId]
          if (!!vaultAddresses?.length) {
            const client = this.publicClients[chainId]
            if (!!client) {
              await validateClientNetwork(chainId, client, source + ` [${chainId}]`)
              const twabControllerAddress = await this.vaults[
                getVaultId({ chainId, address: vaultAddresses[0] })
              ].getTWABController()
              const chainDelegates = await getVaultDelegates(
                client,
                userAddress as Address,
                vaultAddresses,
                twabControllerAddress
              )
              for (const vaultId in chainDelegates) {
                delegates[vaultId] = chainDelegates[vaultId]
              }
            }
          }
        })()
      )
    )

    return delegates
  }

  /**
   * Returns the exchange rate from 1 share to each vaults' underlying assets
   * @param chainIds optional chain IDs to query (by default queries all)
   * @returns
   */
  async getExchangeRates(chainIds?: number[]): Promise<{ [vaultId: string]: bigint }> {
    const exchangeRates: { [vaultId: string]: bigint } = {}
    const networksToQuery = chainIds ?? this.chainIds

    const shareData = await this.getShareData(networksToQuery)

    await Promise.allSettled(
      networksToQuery.map((chainId) =>
        (async () => {
          const client = this.publicClients[chainId]
          if (!!client) {
            const source = `Vaults [getExchangeRates] [${chainId}]`
            await validateClientNetwork(chainId, client, source)
            const chainVaults = getVaultsByChainId(chainId, Object.values(shareData))
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
    byChain: { [chainId: number]: Address[] }
    byVault: { [vaultId: string]: Address }
  }> {
    if (this.underlyingTokenAddresses !== undefined) return this.underlyingTokenAddresses

    const tokenAddresses: {
      byChain: { [chainId: number]: Address[] }
      byVault: { [vaultId: string]: Address }
    } = { byChain: {}, byVault: {} }

    await Promise.allSettled(
      this.chainIds.map((chainId) =>
        (async () => {
          const client = this.publicClients[chainId]
          if (!!client) {
            const source = `Vaults [getUnderlyingTokenAddresses] [${chainId}]`
            await validateClientNetwork(chainId, client, source)
            const chainVaults = getVaultsByChainId(chainId, this.allVaultInfo)
            const chainTokenAddresses = await getVaultUnderlyingTokenAddresses(client, chainVaults)
            Object.assign(tokenAddresses.byVault, chainTokenAddresses)

            const uniqueTokenAddresses = Array.from(
              new Set(Object.values(chainTokenAddresses).filter((address) => !!address))
            )
            tokenAddresses.byChain[chainId] = uniqueTokenAddresses

            Object.keys(chainTokenAddresses).forEach((vaultId) => {
              const tokenAddress = chainTokenAddresses[vaultId]
              this.vaults[vaultId].tokenAddress = tokenAddress
            })
          }
        })()
      )
    )

    this.underlyingTokenAddresses = tokenAddresses

    return this.underlyingTokenAddresses
  }
}
