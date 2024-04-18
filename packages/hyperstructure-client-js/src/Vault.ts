import { TokenWithAmount, TokenWithSupply, TxOverrides } from '@shared/types'
import {
  erc20ABI,
  getTokenAllowances,
  getTokenBalances,
  getTokenInfo,
  getVaultId,
  twabControllerABI,
  validateAddress,
  validateClientNetwork,
  vaultABI
} from '@shared/utilities'
import { Address, parseUnits, PublicClient, WalletClient } from 'viem'

/**
 * This class provides read and write functions to interact with a vault
 */
export class Vault {
  readonly id: string
  walletClient: WalletClient | undefined
  decimals: number | undefined
  tokenAddress: Address | undefined
  tokenData: TokenWithSupply | undefined
  shareData: TokenWithSupply | undefined
  exchangeRate: bigint | undefined
  liquidationPair: Address | undefined
  claimer: Address | undefined
  yieldSource: Address | undefined
  twabController: Address | undefined
  feePercent: number | undefined
  feeRecipient: Address | undefined
  feesAvailable: bigint | undefined
  owner: Address | undefined
  name: string | undefined
  logoURI: string | undefined
  tags: string[] | undefined
  tokenLogoURI: string | undefined
  yieldSourceURI: string | undefined

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
    public address: Address,
    public publicClient: PublicClient,
    options?: {
      walletClient?: WalletClient
      decimals?: number
      tokenAddress?: Address
      name?: string
      logoURI?: string
      tags?: string[]
      tokenLogoURI?: string
      yieldSourceURI?: string
    }
  ) {
    this.id = getVaultId({ address, chainId })

    this.walletClient = options?.walletClient
    this.decimals = options?.decimals
    this.tokenAddress = options?.tokenAddress
    this.name = options?.name
    this.logoURI = options?.logoURI
    this.tags = options?.tags
    this.tokenLogoURI = options?.tokenLogoURI
    this.yieldSourceURI = options?.yieldSourceURI
  }

  /* ============================== Read Functions ============================== */

  /**
   * Returns the address of the vault's underlying asset
   * @returns
   */
  async getTokenAddress(): Promise<Address> {
    if (this.tokenAddress !== undefined) return this.tokenAddress

    const source = 'Vault [getTokenAddress]'
    await validateClientNetwork(this.chainId, this.publicClient, source)

    const tokenAddress = await this.publicClient.readContract({
      address: this.address,
      abi: vaultABI,
      functionName: 'asset'
    })

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

    const tokenBalance = await getTokenBalances(this.publicClient, userAddress as Address, [
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

    const shareBalance = await getTokenBalances(this.publicClient, userAddress as Address, [
      this.address
    ])

    return shareBalance[this.address]
  }

  /**
   * Returns a user's delegate balance for the vault's share token
   * @param userAddress the user's address to get a balance for
   * @returns
   */
  async getUserDelegateBalance(userAddress: string): Promise<bigint> {
    const source = 'Vault [getUserDelegateBalance]'
    await validateClientNetwork(this.chainId, this.publicClient, source)

    const twabController = await this.getTWABController()

    const delegateBalance = await this.publicClient.readContract({
      address: twabController,
      abi: twabControllerABI,
      functionName: 'delegateBalanceOf',
      args: [this.address, userAddress as Address]
    })

    return delegateBalance
  }

  /**
   * Returns a user's delegate for the vault
   * @param userAddress the user's address to get delegate for
   * @returns
   */
  async getUserDelegate(userAddress: string): Promise<Address> {
    const source = 'Vault [getUserDelegate]'
    await validateClientNetwork(this.chainId, this.publicClient, source)

    const twabController = await this.getTWABController()

    const delegate = await this.publicClient.readContract({
      address: twabController,
      abi: twabControllerABI,
      functionName: 'delegateOf',
      args: [this.address, userAddress as Address]
    })

    return delegate
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
      userAddress as Address,
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

    const assets = await this.publicClient.readContract({
      address: this.address,
      abi: vaultABI,
      functionName: 'convertToAssets',
      args: [shares]
    })

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

    const shares = await this.publicClient.readContract({
      address: this.address,
      abi: vaultABI,
      functionName: 'convertToShares',
      args: [assets]
    })

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

    const getTotalAssets = () =>
      this.publicClient
        .readContract({
          address: this.address,
          abi: vaultABI,
          functionName: 'totalPreciseAssets'
        })
        .catch(() => {
          console.warn(
            `${source} | Could not query "totalPreciseAssets" for ${this.address} on network ${this.chainId}, falling back to "totalAssets"`
          )
          return this.publicClient.readContract({
            address: this.address,
            abi: vaultABI,
            functionName: 'totalAssets'
          })
        })

    const totalAssets = await getTotalAssets()

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

  /**
   * Returns the address of the vault's currently set liquidation pair contract
   * @returns
   */
  async getLiquidationPair(): Promise<Address> {
    if (this.liquidationPair !== undefined) return this.liquidationPair

    const source = 'Vault [getLiquidationPair]'
    await validateClientNetwork(this.chainId, this.publicClient, source)

    const liquidationPair = await this.publicClient.readContract({
      address: this.address,
      abi: vaultABI,
      functionName: 'liquidationPair'
    })

    this.liquidationPair = liquidationPair
    return this.liquidationPair
  }

  /**
   * Returns the address of the vault's currently set claimer contract
   * @returns
   */
  async getClaimer(): Promise<Address> {
    if (this.claimer !== undefined) return this.claimer

    const source = 'Vault [getClaimer]'
    await validateClientNetwork(this.chainId, this.publicClient, source)

    const claimer = await this.publicClient.readContract({
      address: this.address,
      abi: vaultABI,
      functionName: 'claimer'
    })

    this.claimer = claimer
    return this.claimer
  }

  /**
   * Returns the address of the vault's underlying yield source
   * @returns
   */
  async getYieldSource(): Promise<Address> {
    if (this.yieldSource !== undefined) return this.yieldSource

    const source = 'Vault [getYieldSource]'
    await validateClientNetwork(this.chainId, this.publicClient, source)

    const yieldSource = await this.publicClient.readContract({
      address: this.address,
      abi: vaultABI,
      functionName: 'yieldVault'
    })

    this.yieldSource = yieldSource
    return this.yieldSource
  }

  /**
   * Returns the address of the vault's TWAB controller
   * @returns
   */
  async getTWABController(): Promise<Address> {
    if (this.twabController !== undefined) return this.twabController

    const source = 'Vault [getTWABController]'
    await validateClientNetwork(this.chainId, this.publicClient, source)

    const twabController = await this.publicClient.readContract({
      address: this.address,
      abi: vaultABI,
      functionName: 'twabController'
    })

    this.twabController = twabController
    return this.twabController
  }

  /**
   * Returns the vault's current fee configuration
   * @returns
   */
  async getFeeInfo(): Promise<{ percent: number; recipient: Address }> {
    if (this.feePercent !== undefined && this.feeRecipient !== undefined) {
      return { percent: this.feePercent, recipient: this.feeRecipient }
    }

    const source = 'Vault [getFeeInfo]'
    await validateClientNetwork(this.chainId, this.publicClient, source)

    if (this.feePercent === undefined) {
      const feeValue = await this.publicClient.readContract({
        address: this.address,
        abi: vaultABI,
        functionName: 'yieldFeePercentage'
      })

      this.feePercent = Number(feeValue)
    }

    if (this.feeRecipient === undefined) {
      const feeRecipient = await this.publicClient.readContract({
        address: this.address,
        abi: vaultABI,
        functionName: 'yieldFeeRecipient'
      })

      this.feeRecipient = feeRecipient
    }

    return { percent: this.feePercent, recipient: this.feeRecipient }
  }

  /**
   * Returns the vault's currently available fee balance to claim
   * @returns
   */
  async getFeesAvailable(): Promise<bigint> {
    const source = 'Vault [getFeesAvailable]'
    await validateClientNetwork(this.chainId, this.publicClient, source)

    const feesAvailable = await this.publicClient.readContract({
      address: this.address,
      abi: vaultABI,
      functionName: 'yieldFeeBalance'
    })

    this.feesAvailable = feesAvailable
    return this.feesAvailable
  }

  /**
   * Returns the address of the vault's owner
   * @returns
   */
  async getOwner(): Promise<Address> {
    if (this.owner !== undefined) return this.owner

    const source = 'Vault [getOwner]'
    await validateClientNetwork(this.chainId, this.publicClient, source)

    const owner = await this.publicClient.readContract({
      address: this.address,
      abi: vaultABI,
      functionName: 'owner'
    })

    this.owner = owner
    return this.owner
  }

  /* ============================== Write Functions ============================== */

  /**
   * Submits a transaction to deposit into the vault
   * @param amount an unformatted token amount (w/ decimals)
   * @param overrides optional overrides for this transaction
   * @returns
   */
  async deposit(amount: bigint, overrides?: TxOverrides) {
    const source = 'Vault [deposit]'

    if (!this.walletClient?.account) {
      throw new Error(`${source} | Invalid/Unavailable Viem Wallet Client`)
    }

    const { request } = await this.publicClient.simulateContract({
      account: this.walletClient.account,
      address: this.address,
      abi: vaultABI,
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
  async depositTo(amount: bigint, receiver: Address, overrides?: TxOverrides) {
    const source = 'Vault [depositTo]'

    if (!this.walletClient?.account) {
      throw new Error(`${source} | Invalid/Unavailable Viem Wallet Client`)
    }

    validateAddress(receiver, source)

    const { request } = await this.publicClient.simulateContract({
      account: this.walletClient.account,
      address: this.address,
      abi: vaultABI,
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
   * @param options optional args or tx overrides
   * @returns
   */
  async withdraw(amount: bigint, options?: { maxShares?: bigint; overrides?: TxOverrides }) {
    const source = 'Vault [withdraw]'

    if (!this.walletClient?.account) {
      throw new Error(`${source} | Invalid/Unavailable Viem Wallet Client`)
    }

    const { request } = await this.publicClient.simulateContract({
      account: this.walletClient.account,
      address: this.address,
      abi: vaultABI,
      functionName: 'withdraw',
      args: !!options?.maxShares
        ? [
            amount,
            this.walletClient.account.address,
            this.walletClient.account.address,
            options.maxShares
          ]
        : [amount, this.walletClient.account.address, this.walletClient.account.address],
      chain: this.walletClient.chain,
      ...options?.overrides
    })

    const txHash = await this.walletClient.writeContract(request)

    return txHash
  }

  /**
   * Submits a transaction to withdraw from the vault and send underlying assets to another address
   * @param amount an unformatted token amount (w/ decimals)
   * @param receiver the address to send assets to
   * @param options optional args or tx overrides
   * @returns
   */
  async withdrawTo(
    amount: bigint,
    receiver: Address,
    options?: { maxShares?: bigint; overrides?: TxOverrides }
  ) {
    const source = 'Vault [withdrawTo]'

    if (!this.walletClient?.account) {
      throw new Error(`${source} | Invalid/Unavailable Viem Wallet Client`)
    }

    validateAddress(receiver, source)

    const { request } = await this.publicClient.simulateContract({
      account: this.walletClient.account,
      address: this.address,
      abi: vaultABI,
      functionName: 'withdraw',
      args: !!options?.maxShares
        ? [amount, receiver, this.walletClient.account.address, options.maxShares]
        : [amount, receiver, this.walletClient.account.address],
      chain: this.walletClient.chain,
      ...options?.overrides
    })

    const txHash = await this.walletClient.writeContract(request)

    return txHash
  }

  /**
   * Submits a transaction to redeem shares from the vault
   * @param amount an unformatted share amount (w/ decimals)
   * @param options optional args or tx overrides
   * @returns
   */
  async redeem(amount: bigint, options?: { minAssets?: bigint; overrides?: TxOverrides }) {
    const source = 'Vault [redeem]'

    if (!this.walletClient?.account) {
      throw new Error(`${source} | Invalid/Unavailable Viem Wallet Client`)
    }

    const { request } = await this.publicClient.simulateContract({
      account: this.walletClient.account,
      address: this.address,
      abi: vaultABI,
      functionName: 'redeem',
      args: !!options?.minAssets
        ? [
            amount,
            this.walletClient.account.address,
            this.walletClient.account.address,
            options.minAssets
          ]
        : [amount, this.walletClient.account.address, this.walletClient.account.address],
      chain: this.walletClient.chain,
      ...options?.overrides
    })

    const txHash = await this.walletClient.writeContract(request)

    return txHash
  }

  /**
   * Submits a transaction to redeem shares from the vault and send underlying assets to another address
   * @param amount an unformatted share amount (w/ decimals)
   * @param receiver the address to send assets to
   * @param options optional args or tx overrides
   * @returns
   */
  async redeemTo(
    amount: bigint,
    receiver: Address,
    options?: { minAssets?: bigint; overrides?: TxOverrides }
  ) {
    const source = 'Vault [redeemTo]'

    if (!this.walletClient?.account) {
      throw new Error(`${source} | Invalid/Unavailable Viem Wallet Client`)
    }

    validateAddress(receiver, source)

    const { request } = await this.publicClient.simulateContract({
      account: this.walletClient.account,
      address: this.address,
      abi: vaultABI,
      functionName: 'redeem',
      args: !!options?.minAssets
        ? [amount, receiver, this.walletClient.account.address, options.minAssets]
        : [amount, receiver, this.walletClient.account.address],
      chain: this.walletClient.chain,
      ...options?.overrides
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
    const source = 'Vault [approveDeposit]'

    if (!this.walletClient?.account) {
      throw new Error(`${source} | Invalid/Unavailable Viem Wallet Client`)
    }

    const tokenAddress = await this.getTokenAddress()

    const { request } = await this.publicClient.simulateContract({
      account: this.walletClient.account,
      address: tokenAddress,
      abi: erc20ABI,
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
    const source = 'Vault [revokeAllowance]'

    if (!this.walletClient?.account) {
      throw new Error(`${source} | Invalid/Unavailable Viem Wallet Client`)
    }

    const tokenAddress = await this.getTokenAddress()

    const { request } = await this.publicClient.simulateContract({
      account: this.walletClient.account,
      address: tokenAddress,
      abi: erc20ABI,
      functionName: 'approve',
      args: [this.address, 0n],
      chain: this.walletClient.chain,
      ...overrides
    })

    const txHash = await this.walletClient.writeContract(request)

    return txHash
  }

  /**
   * Submits a transaction to claim yield fees
   * @param amount an unformatted share amount (w/ decimals)
   * @param overrides optional overrides for this transaction
   * @returns
   */
  async claimFees(amount: bigint, overrides?: TxOverrides) {
    const source = 'Vault [claimFees]'

    if (!this.walletClient?.account) {
      throw new Error(`${source} | Invalid/Unavailable Viem Wallet Client`)
    }

    const { request } = await this.publicClient.simulateContract({
      account: this.walletClient.account,
      address: this.address,
      abi: vaultABI,
      functionName: 'claimYieldFeeShares',
      args: [amount],
      chain: this.walletClient.chain,
      ...overrides
    })

    const txHash = await this.walletClient.writeContract(request)

    return txHash
  }
}
