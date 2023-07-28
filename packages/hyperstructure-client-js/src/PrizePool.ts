import { PrizeInfo, TokenWithSupply, TxOverrides } from '@shared/types'
import {
  getPrizePoolAllPrizeInfo,
  getPrizePoolContributionAmounts,
  getPrizePoolContributionPercentages,
  getPrizePoolId,
  getTokenInfo,
  prizePoolABI,
  validateAddress,
  validateClientNetwork
} from '@shared/utilities'
import { Address, PublicClient, WalletClient } from 'viem'

/**
 * This class provides read and write functions to interact with a prize pool
 */
export class PrizePool {
  readonly id: string
  walletClient: WalletClient | undefined
  prizeTokenAddress: Address | undefined
  drawPeriodInSeconds: number | undefined
  tierShares: number | undefined

  /**
   * Creates an instance of a Prize Pool with a given public and optional wallet client
   *
   * NOTE: If initialized without a wallet Viem client, write functions will not be available
   * @param chainId the prize pool's chain ID
   * @param address the prize pool's address
   * @param publicClient a public Viem client for the network the prize pool is deployed on
   * @param options optional parameters (including wallet client)
   */
  constructor(
    public chainId: number,
    public address: Address,
    public publicClient: PublicClient,
    options?: {
      walletClient?: WalletClient
      prizeTokenAddress?: Address
      drawPeriodInSeconds?: number
      tierShares?: number
    }
  ) {
    this.id = getPrizePoolId(chainId, address)

    if (!!options?.walletClient) {
      this.walletClient = options.walletClient
    }

    if (!!options?.prizeTokenAddress) {
      this.prizeTokenAddress = options.prizeTokenAddress
    }

    if (!!options?.drawPeriodInSeconds) {
      this.drawPeriodInSeconds = options.drawPeriodInSeconds
    }

    if (!!options?.tierShares) {
      this.tierShares = options.tierShares
    }
  }

  /* ============================== Read Functions ============================== */

  /**
   * Returns the address of the token awarded by the prize pool
   * @returns
   */
  async getPrizeTokenAddress(): Promise<Address> {
    if (this.prizeTokenAddress !== undefined) return this.prizeTokenAddress

    const source = 'Vault [getPrizeTokenAddress]'
    await validateClientNetwork(this.chainId, this.publicClient, source)

    const prizeTokenAddress = await this.publicClient.readContract({
      address: this.address,
      abi: prizePoolABI,
      functionName: 'prizeToken'
    })

    this.prizeTokenAddress = prizeTokenAddress
    return this.prizeTokenAddress
  }

  /**
   * Returns basic data about the token awarded by the prize pool
   * @returns
   */
  async getPrizeTokenData(): Promise<TokenWithSupply> {
    const source = 'Prize Pool [getPrizeTokenData]'
    await validateClientNetwork(this.chainId, this.publicClient, source)

    const prizeTokenAddress = await this.getPrizeTokenAddress()

    const prizeTokenInfo = await getTokenInfo(this.publicClient, [prizeTokenAddress])

    return prizeTokenInfo[prizeTokenAddress]
  }

  /**
   * Returns the duration of a draw in seconds
   * @returns
   */
  async getDrawPeriodInSeconds(): Promise<number> {
    if (this.drawPeriodInSeconds !== undefined) return this.drawPeriodInSeconds

    const source = 'Prize Pool [getDrawPeriodInSeconds]'
    await validateClientNetwork(this.chainId, this.publicClient, source)

    const drawPeriodInSeconds = await this.publicClient.readContract({
      address: this.address,
      abi: prizePoolABI,
      functionName: 'drawPeriodSeconds'
    })

    this.drawPeriodInSeconds = drawPeriodInSeconds
    return drawPeriodInSeconds
  }

  /**
   * Returns the number of shares allocated to each prize tier
   * @returns
   */
  async getTierShares(): Promise<number> {
    if (this.tierShares !== undefined) return this.tierShares

    const source = 'Prize Pool [getTierShares]'
    await validateClientNetwork(this.chainId, this.publicClient, source)

    const tierShares = await this.publicClient.readContract({
      address: this.address,
      abi: prizePoolABI,
      functionName: 'tierShares'
    })

    this.tierShares = tierShares
    return tierShares
  }

  /**
   * Returns the number of prize tiers in the prize pool
   *
   * NOTE: Includes the canary tier
   * @returns
   */
  async getNumberOfTiers(): Promise<number> {
    const source = 'Prize Pool [getNumberOfTiers]'
    await validateClientNetwork(this.chainId, this.publicClient, source)

    const numberOfTiers = await this.publicClient.readContract({
      address: this.address,
      abi: prizePoolABI,
      functionName: 'numberOfTiers'
    })

    return numberOfTiers
  }

  /**
   * Returns the prize pool's last awarded draw ID
   * @returns
   */
  async getLastDrawId(): Promise<number> {
    const source = 'Prize Pool [getLastDrawId]'
    await validateClientNetwork(this.chainId, this.publicClient, source)

    const lastDrawId = Number(
      await this.publicClient.readContract({
        address: this.address,
        abi: prizePoolABI,
        functionName: 'getLastCompletedDrawId'
      })
    )

    return lastDrawId
  }

  /**
   * Returns the total token amount contributed by all vaults for the given draw IDs
   * @param startDrawId start draw ID (inclusive)
   * @param endDrawId end draw ID (inclusive)
   * @returns
   */
  async getTotalContributedAmount(startDrawId: number, endDrawId: number): Promise<bigint> {
    const source = 'Prize Pool [getTotalContributedAmount]'
    await validateClientNetwork(this.chainId, this.publicClient, source)

    const totalContributedAmount = await this.publicClient.readContract({
      address: this.address,
      abi: prizePoolABI,
      functionName: 'getTotalContributedBetween',
      args: [startDrawId, endDrawId]
    })

    return totalContributedAmount
  }

  /**
   * Returns the token amounts contributed by any vaults for the given draw IDs
   * @param vaultAddresses vault addresses to get contributions from
   * @param startDrawId start draw ID (inclusive)
   * @param endDrawId end draw ID (inclusive)
   * @returns
   */
  async getVaultContributedAmounts(
    vaultAddresses: Address[],
    startDrawId: number,
    endDrawId: number
  ): Promise<{ [vaultId: string]: bigint }> {
    const source = 'Prize Pool [getVaultContributedAmounts]'
    await validateClientNetwork(this.chainId, this.publicClient, source)

    const contributedAmounts = await getPrizePoolContributionAmounts(
      this.publicClient,
      this.address,
      vaultAddresses,
      startDrawId,
      endDrawId
    )

    return contributedAmounts
  }

  /**
   * Returns the percentage of the total prize pool contributions for any vaults for the given draw IDs
   *
   * NOTE: Percentage value from 0 to 1 (eg: 0.25 representing 25%)
   * @param vaultAddresses vault addresses to get contributions from
   * @param startDrawId start draw ID (inclusive)
   * @param endDrawId end draw ID (inclusive)
   * @returns
   */
  async getVaultContributedPercentages(
    vaultAddresses: Address[],
    startDrawId: number,
    endDrawId: number
  ): Promise<{ [vaultId: string]: number }> {
    const source = 'Prize Pool [getVaultContributedPercentages]'
    await validateClientNetwork(this.chainId, this.publicClient, source)

    const contributedPercentages = await getPrizePoolContributionPercentages(
      this.publicClient,
      this.address,
      vaultAddresses,
      startDrawId,
      endDrawId
    )

    return contributedPercentages
  }

  /**
   * Returns the start timestamp of the last completed draw (in seconds)
   * @returns
   */
  async getLastDrawStartTimestamp(): Promise<number> {
    const source = 'Prize Pool [getLastDrawStartTimestamp]'
    await validateClientNetwork(this.chainId, this.publicClient, source)

    const startTimestamp = Number(
      await this.publicClient.readContract({
        address: this.address,
        abi: prizePoolABI,
        functionName: 'lastCompletedDrawStartedAt'
      })
    )

    return startTimestamp
  }

  /**
   * Returns the start timestamp of the next draw (in seconds)
   * @returns
   */
  async getNextDrawStartTimestamp(): Promise<number> {
    const source = 'Prize Pool [getNextDrawStartTimestamp]'
    await validateClientNetwork(this.chainId, this.publicClient, source)

    const startTimestamp = Number(
      await this.publicClient.readContract({
        address: this.address,
        abi: prizePoolABI,
        functionName: 'nextDrawStartsAt'
      })
    )

    return startTimestamp
  }

  /**
   * Checks if a user has won a specific prize tier and index while deposited in a given vault
   * @param vaultAddress vault address to check
   * @param userAddress user address to check prizes for
   * @param tier prize tier to check
   * @param prizeIndex prize index to check
   * @returns
   */
  async isWinner(
    vaultAddress: Address,
    userAddress: Address,
    tier: number,
    prizeIndex: number
  ): Promise<boolean> {
    const source = 'Prize Pool [isWinner]'
    validateAddress(vaultAddress, source)
    validateAddress(userAddress, source)
    await validateClientNetwork(this.chainId, this.publicClient, source)

    const isWinner = await this.publicClient.readContract({
      address: this.address,
      abi: prizePoolABI,
      functionName: 'isWinner',
      args: [vaultAddress, userAddress, tier, prizeIndex]
    })

    return isWinner
  }

  /**
   * Returns the prize size of a given tier
   * @param tier prize tier
   * @returns
   */
  async getTierPrizeSize(tier: number): Promise<bigint> {
    const source = 'Prize Pool [getTierPrizeSize]'
    await validateClientNetwork(this.chainId, this.publicClient, source)

    const tierPrizeSize = await this.publicClient.readContract({
      address: this.address,
      abi: prizePoolABI,
      functionName: 'getTierPrizeSize',
      args: [tier]
    })

    return tierPrizeSize
  }

  /**
   * Returns the estimated time to award a given tier (in seconds)
   * @param tier prize tier
   * @returns
   */
  async getEstimatedTierAwardTime(tier: number): Promise<number> {
    const source = 'Prize Pool [getEstimatedTierAwardTime]'
    await validateClientNetwork(this.chainId, this.publicClient, source)

    const estimatedDraws = await this.publicClient.readContract({
      address: this.address,
      abi: prizePoolABI,
      functionName: 'getTierAccrualDurationInDraws',
      args: [tier]
    })

    const drawPeriod = await this.getDrawPeriodInSeconds()

    return estimatedDraws * drawPeriod
  }

  /**
   * Returns the estimated number of prizes awarded based on number of tiers active
   * @returns
   */
  async getEstimatedPrizeCount(): Promise<number> {
    const source = 'Prize Pool [getEstimatedPrizeCount]'
    await validateClientNetwork(this.chainId, this.publicClient, source)

    const estimatedPrizeCount = await this.publicClient.readContract({
      address: this.address,
      abi: prizePoolABI,
      functionName: 'estimatedPrizeCount'
    })

    return estimatedPrizeCount
  }

  /**
   * Returns estimated prize amounts and frequency for all prize tiers
   * @returns
   */
  async getAllPrizeInfo(): Promise<PrizeInfo[]> {
    const source = 'Prize Pool [getAllPrizeInfo]'
    await validateClientNetwork(this.chainId, this.publicClient, source)

    const numberOfTiers = await this.getNumberOfTiers()
    const tiers = Array.from(Array(numberOfTiers).keys())

    const allPrizeInfo = await getPrizePoolAllPrizeInfo(this.publicClient, this.address, tiers)

    return allPrizeInfo
  }

  /**
   * Returns given vaults' prize power (percentage of latest contributions)
   * @param vaultAddresses vault addresses to get prize power from
   * @returns
   */
  async getVaultPrizePowers(
    vaultAddresses: Address[],
    numDraws: number = 7
  ): Promise<{ [vaultId: string]: number }> {
    const lastDrawId = await this.getLastDrawId()

    const prizePowers = await this.getVaultContributedPercentages(
      vaultAddresses,
      lastDrawId > numDraws ? lastDrawId - numDraws + 1 : 1,
      lastDrawId
    )

    return prizePowers
  }

  /* ============================== Write Functions ============================== */

  /**
   * Submits a transaction to claim prizes from the prize pool
   * @param tier the prize tier to claim
   * @param winners the user addresses that won a given tier's prize
   * @param prizeIndices the indices of each prize, for each winner
   * @param options optional fees, fee recipient and overrides for this transaction
   * @returns
   */
  async claimPrizes(
    tier: number,
    winners: Address[],
    prizeIndices: number[][],
    options?: {
      fee?: { amount: bigint; recipient: Address }
      overrides?: TxOverrides
    }
  ) {
    const source = 'Prize Pool [claimPrizes]'

    if (!this.walletClient?.account) {
      throw new Error(`${source} | Invalid/Unavailable Viem Wallet Client`)
    }

    const { request } = await this.publicClient.simulateContract({
      account: this.walletClient.account,
      address: this.address,
      abi: prizePoolABI,
      functionName: 'claimPrizes',
      args: [
        tier,
        winners,
        prizeIndices,
        options?.fee?.amount ?? 0n,
        options?.fee?.recipient ?? this.walletClient.account.address
      ],
      chain: this.walletClient.chain,
      ...options?.overrides
    })

    const txHash = await this.walletClient.writeContract(request)

    return txHash
  }

  /**
   * Submits a transaction to complete the current draw and start the next draw
   * @param winningRandomNumber randomly generated winning number
   * @param overrides optional overrides for this transaction
   * @returns
   */
  async completeAndStartNextDraw(winningRandomNumber: bigint, overrides?: TxOverrides) {
    const source = 'Prize Pool [completeAndStartNextDraw]'

    if (!this.walletClient?.account) {
      throw new Error(`${source} | Invalid/Unavailable Viem Wallet Client`)
    }

    const { request } = await this.publicClient.simulateContract({
      account: this.walletClient.account,
      address: this.address,
      abi: prizePoolABI,
      functionName: 'completeAndStartNextDraw',
      args: [winningRandomNumber],
      chain: this.walletClient.chain,
      ...overrides
    })

    const txHash = await this.walletClient.writeContract(request)

    return txHash
  }

  /* ============================== Other Functions ============================== */

  /**
   * Returns the number of prizes in a given prize tier
   * @param tier prize tier
   * @returns
   */
  getTierPrizeCount(tier: number): number {
    return 4 ** tier
  }
}
