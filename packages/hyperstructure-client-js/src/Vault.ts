import { TokenWithAmount, TokenWithSupply, TxOverrides } from '@shared/types'
import {
  erc20 as erc20Abi,
  erc4626 as erc4626Abi,
  getTokenAllowances,
  getTokenBalances,
  getTokenInfo,
  getVaultId,
  validateAddress,
  validateClientNetwork
} from '@shared/utilities'
import { getContract, parseUnits, PublicClient, WalletClient } from 'viem'

/**
 * This class provides read and write functions to interact with a vault
 */
export class Vault {
  readonly vaultContract: any // TODO: get proper contract typing
  readonly id: string
  walletClient: WalletClient | undefined
  decimals: number | undefined
  tokenAddress: `0x${string}` | undefined
  tokenContract: any // TODO: get proper contract typing
  tokenData: TokenWithSupply | undefined
  shareData: TokenWithSupply | undefined
  exchangeRate: bigint | undefined
  name: string | undefined
  logoURI: string | undefined
  tokenLogoURI: string | undefined

  /**
   * Creates an instance of a Vault with a given public and optional wallet client
   *
   * NOTE: If initialized without a wallet Viem client, write functions will not be available
   * @param chainId the vault's chain ID
   * @param address the vault's address
   * @param publicClient a public Viem client for the network the vault is deployed on
   * @param options optional parameters (including wallet client)
   */
  constructor(
    public chainId: number,
    public address: `0x${string}`,
    public publicClient: PublicClient,
    options?: {
      walletClient?: WalletClient
      decimals?: number
      tokenAddress?: `0x${string}`
      name?: string
      logoURI?: string
      tokenLogoURI?: string
    }
  ) {
    this.vaultContract = getContract({ address, abi: erc4626Abi, publicClient })
    this.id = getVaultId({ address, chainId })

    if (!!options?.walletClient) {
      this.walletClient = options.walletClient
    }

    if (!!options?.decimals) {
      this.decimals = options.decimals
    }

    if (!!options?.tokenAddress) {
      this.tokenAddress = options.tokenAddress
      this.tokenContract = getContract({
        address: options.tokenAddress,
        abi: erc20Abi,
        publicClient
      })
    }

    if (!!options?.name) {
      this.name = options.name
    }

    if (!!options?.logoURI) {
      this.logoURI = options.logoURI
    }

    if (!!options?.tokenLogoURI) {
      this.tokenLogoURI = options.tokenLogoURI
    }
  }

  /* ============================== Read Functions ============================== */

  /**
   * Returns the address of the vault's underlying asset
   * @returns
   */
  async getTokenAddress(): Promise<`0x${string}`> {
    if (this.tokenAddress !== undefined) return this.tokenAddress

    const source = 'Vault [getTokenAddress]'
    await validateClientNetwork(this.chainId, this.publicClient, source)

    const tokenAddress: `0x${string}` = await this.vaultContract.read.asset()

    this.tokenAddress = tokenAddress
    return this.tokenAddress
  }

  /**
   * Returns basic data about the vault's underlying asset
   * @returns
   */
  async getTokenData(): Promise<TokenWithSupply> {
    if (this.tokenData !== undefined) return this.tokenData

    const source = 'Vault [getTokenData]'
    await validateClientNetwork(this.chainId, this.publicClient, source)

    const tokenAddress = await this.getTokenAddress()

    const tokenData = (await getTokenInfo(this.publicClient, [tokenAddress]))[tokenAddress]

    if (!!tokenData && !isNaN(tokenData.decimals)) {
      this.decimals = tokenData.decimals
    }

    this.tokenData = tokenData
    return this.tokenData
  }

  /**
   * Returns basic data about the vault's share token
   * @returns
   */
  async getShareData(): Promise<TokenWithSupply> {
    if (this.shareData !== undefined) return this.shareData

    const source = 'Vault [getShareData]'
    await validateClientNetwork(this.chainId, this.publicClient, source)

    const shareData = (await getTokenInfo(this.publicClient, [this.address]))[this.address]

    if (!!shareData) {
      if (!isNaN(shareData.decimals)) {
        this.decimals = shareData.decimals
      }

      if (this.name === undefined) {
        this.name = shareData.name
      }
    }

    this.shareData = shareData
    return this.shareData
  }

  /**
   * Returns a user's balance for the vault's underlying asset
   * @param userAddress the user's address to get a balance for
   * @returns
   */
  async getUserTokenBalance(userAddress: string): Promise<TokenWithAmount> {
    const source = 'Vault [getUserTokenBalance]'
    validateAddress(userAddress, source)
    await validateClientNetwork(this.chainId, this.publicClient, source)

    const tokenAddress = await this.getTokenAddress()

    const tokenBalance = await getTokenBalances(this.publicClient, userAddress as `0x${string}`, [
      tokenAddress
    ])

    return tokenBalance[tokenAddress]
  }

  /**
   * Returns a user's balance for the vault's share token
   * @param userAddress the user's address to get a balance for
   * @returns
   */
  async getUserShareBalance(userAddress: string): Promise<TokenWithAmount> {
    const source = 'Vault [getUserShareBalance]'
    validateAddress(userAddress, source)
    await validateClientNetwork(this.chainId, this.publicClient, source)

    const shareBalance = await getTokenBalances(this.publicClient, userAddress as `0x${string}`, [
      this.address
    ])

    return shareBalance[this.address]
  }

  /**
   * Returns a user's allowance for the vault's underlying asset
   * @param userAddress the user's address to get an allowance for
   * @returns
   */
  async getUserTokenAllowance(userAddress: string): Promise<bigint> {
    const source = 'Vault [getUserTokenAllowance]'
    validateAddress(userAddress, source)
    await validateClientNetwork(this.chainId, this.publicClient, source)

    const tokenAddress = await this.getTokenAddress()

    const tokenAllowance = await getTokenAllowances(
      this.publicClient,
      userAddress as `0x${string}`,
      this.address,
      [tokenAddress]
    )

    return tokenAllowance[tokenAddress]
  }

  /**
   * Returns the equivalent amount of underlying assets from a share amount
   * @param shares the amount of shares to convert
   * @returns
   */
  async getAssetsFromShares(shares: bigint): Promise<bigint> {
    const source = 'Vault [getAssetsFromShares]'
    await validateClientNetwork(this.chainId, this.publicClient, source)

    const assets: bigint = await this.vaultContract.read.convertToAssets([shares])

    return assets
  }

  /**
   * Returns the equivalent amount of shares from an underlying asset amount
   * @param assets the amount of assets to convert
   * @returns
   */
  async getSharesFromAssets(assets: bigint): Promise<bigint> {
    const source = 'Vault [getSharesFromAssets]'
    await validateClientNetwork(this.chainId, this.publicClient, source)

    const shares: bigint = await this.vaultContract.read.convertToShares([assets])

    return shares
  }

  /**
   * Returns the total amount of underlying assets deposited in the vault
   * @returns
   */
  async getTotalTokenBalance(): Promise<TokenWithAmount> {
    const source = 'Vault [getTotalTokenBalance]'
    await validateClientNetwork(this.chainId, this.publicClient, source)

    const tokenData = await this.getTokenData()

    const totalAssets: bigint = await this.vaultContract.read.totalAssets()

    return { ...tokenData, amount: totalAssets }
  }

  /**
   * Returns the exchange rate from 1 share to the vault's underlying asset
   * @returns
   */
  async getExchangeRate(): Promise<bigint> {
    const source = 'Vault [getExchangeRate]'
    await validateClientNetwork(this.chainId, this.publicClient, source)

    const decimals = this.decimals ?? (await this.getTokenData()).decimals

    const exchangeRate = await this.getAssetsFromShares(parseUnits('1', decimals))

    this.exchangeRate = exchangeRate
    return this.exchangeRate
  }

  /* ============================== Write Functions ============================== */

  /**
   * Submits a transaction to deposit into the vault
   * @param amount an unformatted token amount (w/ decimals)
   * @param overrides optional overrides for this transaction
   * @returns
   */
  async deposit(amount: bigint, overrides?: TxOverrides) {
    const source = 'User [deposit]'

    if (!this.walletClient?.account) {
      throw new Error(`${source} | Invalid/Unavailable Viem Wallet Client`)
    }

    const { request } = await this.publicClient.simulateContract({
      account: this.walletClient.account,
      address: this.address,
      abi: erc4626Abi,
      functionName: 'deposit',
      args: [amount, this.walletClient.account.address],
      chain: this.walletClient.chain,
      ...overrides
    })

    const txHash = await this.walletClient.writeContract(request)

    return txHash
  }

  /**
   * Submits a transaction to deposit into the vault and send shares to another address
   * @param amount an unformatted token amount (w/ decimals)
   * @param receiver the address to send shares to
   * @param overrides optional overrides for this transaction
   * @returns
   */
  async depositTo(amount: bigint, receiver: string, overrides?: TxOverrides) {
    const source = 'User [depositTo]'

    if (!this.walletClient?.account) {
      throw new Error(`${source} | Invalid/Unavailable Viem Wallet Client`)
    }

    validateAddress(receiver, source)

    const { request } = await this.publicClient.simulateContract({
      account: this.walletClient.account,
      address: this.address,
      abi: erc4626Abi,
      functionName: 'deposit',
      args: [amount, receiver],
      chain: this.walletClient.chain,
      ...overrides
    })

    const txHash = await this.walletClient.writeContract(request)

    return txHash
  }

  /**
   * Submits a transaction to withdraw from the vault
   * @param amount an unformatted token amount (w/ decimals)
   * @param overrides optional overrides for this transaction
   * @returns
   */
  async withdraw(amount: bigint, overrides?: TxOverrides) {
    const source = 'User [withdraw]'

    if (!this.walletClient?.account) {
      throw new Error(`${source} | Invalid/Unavailable Viem Wallet Client`)
    }

    const { request } = await this.publicClient.simulateContract({
      account: this.walletClient.account,
      address: this.address,
      abi: erc4626Abi,
      functionName: 'withdraw',
      args: [amount, this.walletClient.account.address, this.walletClient.account.address],
      chain: this.walletClient.chain,
      ...overrides
    })

    const txHash = await this.walletClient.writeContract(request)

    return txHash
  }

  /**
   * Submits a transaction to withdraw from the vault and send underlying assets to another address
   * @param amount an unformatted token amount (w/ decimals)
   * @param receiver the address to send assets to
   * @param overrides optional overrides for this transaction
   * @returns
   */
  async withdrawTo(amount: bigint, receiver: string, overrides?: TxOverrides) {
    const source = 'User [withdrawTo]'

    if (!this.walletClient?.account) {
      throw new Error(`${source} | Invalid/Unavailable Viem Wallet Client`)
    }

    validateAddress(receiver, source)

    const { request } = await this.publicClient.simulateContract({
      account: this.walletClient.account,
      address: this.address,
      abi: erc4626Abi,
      functionName: 'withdraw',
      args: [amount, receiver, this.walletClient.account.address],
      chain: this.walletClient.chain,
      ...overrides
    })

    const txHash = await this.walletClient.writeContract(request)

    return txHash
  }

  /**
   * Submits a transaction to redeem shares from the vault
   * @param amount an unformatted share amount (w/ decimals)
   * @param overrides optional overrides for this transaction
   * @returns
   */
  async redeem(amount: bigint, overrides?: TxOverrides) {
    const source = 'User [redeem]'

    if (!this.walletClient?.account) {
      throw new Error(`${source} | Invalid/Unavailable Viem Wallet Client`)
    }

    const { request } = await this.publicClient.simulateContract({
      account: this.walletClient.account,
      address: this.address,
      abi: erc4626Abi,
      functionName: 'redeem',
      args: [amount, this.walletClient.account.address, this.walletClient.account.address],
      chain: this.walletClient.chain,
      ...overrides
    })

    const txHash = await this.walletClient.writeContract(request)

    return txHash
  }

  /**
   * Submits a transaction to redeem shares from the vault and send underlying assets to another address
   * @param amount an unformatted share amount (w/ decimals)
   * @param receiver the address to send assets to
   * @param overrides optional overrides for this transaction
   * @returns
   */
  async redeemTo(amount: bigint, receiver: string, overrides?: TxOverrides) {
    const source = 'User [redeemTo]'

    if (!this.walletClient?.account) {
      throw new Error(`${source} | Invalid/Unavailable Viem Wallet Client`)
    }

    validateAddress(receiver, source)

    const { request } = await this.publicClient.simulateContract({
      account: this.walletClient.account,
      address: this.address,
      abi: erc4626Abi,
      functionName: 'redeem',
      args: [amount, receiver, this.walletClient.account.address],
      chain: this.walletClient.chain,
      ...overrides
    })

    const txHash = await this.walletClient.writeContract(request)

    return txHash
  }

  /**
   * Submits a transaction to set an allowance for vault deposits
   * @param amount an unformatted token amount (w/ decimals)
   * @param overrides optional overrides for this transaction
   * @returns
   */
  async approveDeposit(amount: bigint, overrides?: TxOverrides) {
    const source = 'User [approveDeposit]'

    if (!this.walletClient?.account) {
      throw new Error(`${source} | Invalid/Unavailable Viem Wallet Client`)
    }

    const tokenAddress = await this.getTokenAddress()

    const { request } = await this.publicClient.simulateContract({
      account: this.walletClient.account,
      address: tokenAddress,
      abi: erc20Abi,
      functionName: 'approve',
      args: [this.address, amount],
      chain: this.walletClient.chain,
      ...overrides
    })

    const txHash = await this.walletClient.writeContract(request)

    return txHash
  }

  /**
   * Submits a transaction to set an allowance of 0 for vault deposits
   * @param overrides optional overrides for this transaction
   * @returns
   */
  async revokeAllowance(overrides?: TxOverrides) {
    const source = 'User [revokeAllowance]'

    if (!this.walletClient?.account) {
      throw new Error(`${source} | Invalid/Unavailable Viem Wallet Client`)
    }

    const tokenAddress = await this.getTokenAddress()

    const { request } = await this.publicClient.simulateContract({
      account: this.walletClient.account,
      address: tokenAddress,
      abi: erc20Abi,
      functionName: 'approve',
      args: [this.address, 0],
      chain: this.walletClient.chain,
      ...overrides
    })

    const txHash = await this.walletClient.writeContract(request)

    return txHash
  }

  /* =========================== Contract Initializers =========================== */

  // TODO: get proper contract typing
  /**
   * Initializes a contract for the vault's underlying asset
   * @returns
   */
  async getTokenContract(): Promise<any> {
    if (this.tokenContract !== undefined) return this.tokenContract

    const tokenAddress = await this.getTokenAddress()

    const tokenContract = getContract({
      address: tokenAddress,
      abi: erc20Abi,
      publicClient: this.publicClient
    })

    this.tokenContract = tokenContract
    return this.tokenContract
  }
}
