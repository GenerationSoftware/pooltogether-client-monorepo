import { PrizeInfo, TokenWithSupply, TxOverrides } from '@shared/types'
import {
  checkPrizePoolWins,
  erc20 as erc20Abi,
  getPrizePoolAllPrizeInfo,
  getPrizePoolContributionAmounts,
  getPrizePoolContributionPercentages,
  getPrizePoolId,
  getTokenInfo,
  prizePool as prizePoolAbi,
  validateAddress,
  validateClientNetwork
} from '@shared/utilities'
import { getContract, PublicClient, WalletClient } from 'viem'

/**
 * This class provides read and write functions to interact with a prize pool
 */
export class PrizePool {
  readonly prizePoolContract: any // TODO: get proper contract typing
  readonly id: string
  walletClient: WalletClient | undefined
  prizeTokenAddress: `0x${string}` | undefined
  prizeTokenContract: any // TODO: get proper contract typing
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
    public address: `0x${string}`,
    public publicClient: PublicClient,
    options?: {
      walletClient?: WalletClient
      prizeTokenAddress?: `0x${string}`
      drawPeriodInSeconds?: number
      tierShares?: number
    }
  ) {
    this.prizePoolContract = getContract({ address, abi: prizePoolAbi, publicClient })
    this.id = getPrizePoolId(chainId, address)

    if (!!options?.walletClient) {
      this.walletClient = options.walletClient
    }

    if (!!options?.prizeTokenAddress) {
      this.prizeTokenAddress = options.prizeTokenAddress
      this.prizeTokenContract = getContract({
        address: options.prizeTokenAddress,
        abi: erc20Abi,
        publicClient
      })
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
  async getPrizeTokenAddress(): Promise<`0x${string}`> {
    if (this.prizeTokenAddress !== undefined) return this.prizeTokenAddress

    const source = 'Vault [getPrizeTokenAddress]'
    await validateClientNetwork(this.chainId, this.publicClient, source)

    const prizeTokenAddress: `0x${string}` = await this.prizePoolContract.read.prizeToken()

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

    const drawPeriodInSeconds = Number(await this.prizePoolContract.read.drawPeriodSeconds())
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

    const tierShares = Number(await this.prizePoolContract.read.tierShares())
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

    const numberOfTiers = Number(await this.prizePoolContract.read.numberOfTiers())

    return numberOfTiers
  }

  /**
   * Returns the prize pool's last awarded draw ID
   * @returns
   */
  async getLastDrawId(): Promise<number> {
    const source = 'Prize Pool [getLastDrawId]'
    await validateClientNetwork(this.chainId, this.publicClient, source)

    const lastDrawId = Number(await this.prizePoolContract.read.getLastCompletedDrawId())

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

    const totalContributedAmount: bigint = await this.prizePoolContract.getTotalContributedBetween(
      startDrawId,
      endDrawId
    )

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
    vaultAddresses: `0x${string}`[],
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
    vaultAddresses: `0x${string}`[],
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

    const startTimestamp = Number(await this.prizePoolContract.read.lastCompletedDrawStartedAt())

    return startTimestamp
  }

  /**
   * Returns the start timestamp of the next draw (in seconds)
   * @returns
   */
  async getNextDrawStartTimestamp(): Promise<number> {
    const source = 'Prize Pool [getNextDrawStartTimestamp]'
    await validateClientNetwork(this.chainId, this.publicClient, source)

    const startTimestamp = Number(await this.prizePoolContract.read.nextDrawStartsAt())

    return startTimestamp
  }

  /**
   * Checks if a user has won a specific prize tier while deposited in a given vault
   * @param vaultAddress vault address to check
   * @param userAddress user address to check prizes for
   * @param tier prize tier to check
   * @returns
   */
  async isTierWinner(vaultAddress: string, userAddress: string, tier: number): Promise<boolean> {
    const source = 'Prize Pool [isTierWinner]'
    validateAddress(vaultAddress, source)
    validateAddress(userAddress, source)
    await validateClientNetwork(this.chainId, this.publicClient, source)

    const isWinner: boolean = await this.prizePoolContract.read.isWinner([
      vaultAddress,
      userAddress,
      tier
    ])

    return isWinner
  }

  /**
   * Checks if a user has won any prizes on the given vaults
   * @param vaultAddresses vault addresses to check
   * @param userAddress user address to check prizes for
   * @returns
   */
  async checkWins(
    vaultAddresses: `0x${string}`[],
    userAddress: `0x${string}`
  ): Promise<{ [vaultId: string]: number[] }> {
    const source = 'Prize Pool [isWinner]'
    validateAddress(userAddress, source)
    await validateClientNetwork(this.chainId, this.publicClient, source)

    const numberOfTiers = await this.getNumberOfTiers()
    const tiers = Array.from(Array(numberOfTiers).keys())

    const wins = await checkPrizePoolWins(
      this.publicClient,
      this.address,
      vaultAddresses,
      userAddress,
      tiers
    )

    return wins
  }

  /**
   * Returns the current prize size of a given tier
   * @param tier prize tier
   * @returns
   */
  async getCurrentPrizeSize(tier: number): Promise<bigint> {
    const source = 'Prize Pool [getCurrentPrizeSize]'
    await validateClientNetwork(this.chainId, this.publicClient, source)

    const currentPrizeSize: bigint = await this.prizePoolContract.read.calculatePrizeSize([tier])

    return currentPrizeSize
  }

  /**
   * Returns the estimated time to award a given tier (in seconds)
   * @param tier prize tier
   * @returns
   */
  async getEstimatedTierAwardTime(tier: number): Promise<number> {
    const source = 'Prize Pool [getEstimatedTierAwardTime]'
    await validateClientNetwork(this.chainId, this.publicClient, source)

    const estimatedDraws = Number(
      await this.prizePoolContract.read.getTierAccrualDurationInDraws([tier])
    )

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

    const estimatedPrizeCount = Number(await this.prizePoolContract.read.estimatedPrizeCount())

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
    vaultAddresses: `0x${string}`[],
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
   * Submits a transaction to claim a prize from the prize pool
   * @param userAddress the address that won the prize
   * @param tier the prize tier to claim
   * @param options optional receiver, fees and overrides for this transaction
   * @returns
   */
  async claimPrize(
    userAddress: `0x${string}`,
    tier: number,
    options?: {
      receiver?: `0x${string}`
      fee?: { amount: bigint; receiver: `0x${string}` }
      overrides?: TxOverrides
    }
  ) {
    const source = 'Prize Pool [claimPrize]'

    if (!this.walletClient?.account) {
      throw new Error(`${source} | Invalid/Unavailable Viem Wallet Client`)
    }

    const { request } = await this.publicClient.simulateContract({
      account: this.walletClient.account,
      address: this.address,
      abi: prizePoolAbi,
      functionName: 'claimPrize',
      args: [
        userAddress,
        tier,
        options?.receiver ?? userAddress,
        options?.fee?.amount ?? 0,
        options?.fee?.receiver ?? userAddress
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
      abi: prizePoolAbi,
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

  /* =========================== Contract Initializers =========================== */

  // TODO: get proper contract typing
  /**
   * Initializes a contract for the token awarded by the prize pool
   * @returns
   */
  async getPrizeTokenContract(): Promise<any> {
    if (this.prizeTokenContract !== undefined) return this.prizeTokenContract

    const prizeTokenAddress = await this.getPrizeTokenAddress()

    const prizeTokenContract = getContract({
      address: prizeTokenAddress,
      abi: erc20Abi,
      publicClient: this.publicClient
    })

    this.prizeTokenContract = prizeTokenContract
    return this.prizeTokenContract
  }
}
