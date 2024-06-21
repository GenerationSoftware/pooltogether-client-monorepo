import { PrizePool, Vault } from '@generationsoftware/hyperstructure-client-js'
import { PartialPromotionInfo, Token, TokenWithLogo, TokenWithPrice } from '@shared/types'
import {
  getAssetsFromShares,
  getPromotionCreatedEvents,
  getPromotions,
  getSecondsSinceEpoch,
  getTokenInfo,
  getTokenPrices,
  getVaultId,
  lower,
  PRIZE_POOLS,
  SECONDS_PER_YEAR
} from '@shared/utilities'
import defaultVaultList from '@vaultLists/default'
import {
  Address,
  createPublicClient,
  formatEther,
  formatUnits,
  http,
  isAddress,
  parseEther,
  PublicClient
} from 'viem'
import { RPC_URLS, TWAB_REWARDS_SETTINGS, WAGMI_CHAINS } from '@constants/config'
import { VaultApiParams } from './route'

export const getChainIdFromParams = (params: VaultApiParams) => {
  const rawChainId =
    !!params.chainId && typeof params.chainId === 'string' ? parseInt(params.chainId) : undefined
  return !!rawChainId &&
    PRIZE_POOLS.map((pool) => pool.chainId).includes(rawChainId) &&
    Object.keys(RPC_URLS)
      .map((k) => parseInt(k))
      .includes(rawChainId)
    ? (rawChainId as keyof typeof RPC_URLS)
    : undefined
}

export const getVaultAddressFromParams = (params: VaultApiParams) => {
  const rawAddress =
    !!params.vaultAddress && typeof params.vaultAddress === 'string'
      ? params.vaultAddress
      : undefined
  return !!rawAddress && isAddress(params.vaultAddress) ? params.vaultAddress : undefined
}

export const getVault = (
  chainId: NonNullable<ReturnType<typeof getChainIdFromParams>>,
  address: Address
) => {
  const publicClient = createPublicClient({
    chain: WAGMI_CHAINS[chainId],
    transport: http(RPC_URLS[chainId])
  }) as PublicClient

  const existingVaultInfo = defaultVaultList.tokens.find(
    (t) => getVaultId(t) === getVaultId({ chainId, address })
  )

  const vault = new Vault(chainId, address, publicClient, {
    decimals: existingVaultInfo?.decimals,
    logoURI: existingVaultInfo?.logoURI,
    name: existingVaultInfo?.name,
    tags: existingVaultInfo?.tags,
    tokenAddress: existingVaultInfo?.extensions?.underlyingAsset?.address,
    tokenLogoURI: existingVaultInfo?.extensions?.underlyingAsset?.logoURI,
    yieldSourceName: existingVaultInfo?.extensions?.yieldSource?.name,
    yieldSourceURI: existingVaultInfo?.extensions?.yieldSource?.appURI
  })

  return vault
}

export const getPrizePool = (vault: Vault) => {
  const { chainId, address, options } = PRIZE_POOLS.find((pool) => pool.chainId === vault.chainId)!

  const prizePool = new PrizePool(chainId, address, vault.publicClient, options)

  return prizePool
}

// TODO: use multicall batches for efficiency
export const getVaultData = async (vault: Vault, prizePool: PrizePool) => {
  const shareData = await vault.getShareData()
  const assetData = await vault.getTotalTokenBalance()
  const exchangeRate = await vault.getExchangeRate()
  const yieldSourceAddress = await vault.getYieldSource()
  const owner = await vault.getOwner()
  const liquidationPair = await vault.getLiquidationPair()
  const claimer = await vault.getClaimer()
  const yieldFees = await vault.getFeeInfo()

  const lastDrawId = (await prizePool.getLastAwardedDrawId()) || 1
  const drawPeriod = await prizePool.getDrawPeriodInSeconds()
  const prizeAssetData = await prizePool.getPrizeTokenData()

  const getContributions = async (startDrawId: number) =>
    (await prizePool.getVaultContributedAmounts([vault.address], startDrawId, lastDrawId))[vault.id]
  const dailyContributions = await getContributions(lastDrawId)
  const weeklyContributions = await getContributions(Math.max(0, lastDrawId - 6))
  const monthlyContributions = await getContributions(Math.max(0, lastDrawId - 29))
  const allTimeContributions = await getContributions(0)

  const getSupplyTwab = async (numDraws: number) =>
    (await prizePool.getVaultTotalSupplyTwabs([vault.address], numDraws))[vault.id]
  const dailySupplyTwab = await getSupplyTwab(1)
  const weeklySupplyTwab = await getSupplyTwab(7)
  const monthlySupplyTwab = await getSupplyTwab(30)
  const allTimeSupplyTwab = await getSupplyTwab(lastDrawId)

  const prices = await getTokenPrices(vault.chainId, [
    assetData.address,
    prizeAssetData.address,
    ...TWAB_REWARDS_SETTINGS[vault.chainId]?.tokenAddresses
  ])

  const assetPrice = prices[lower(assetData.address)]
  const sharePrice =
    !!assetPrice && !!exchangeRate
      ? parseFloat(
          formatEther(
            getAssetsFromShares(parseEther(`${assetPrice}`), exchangeRate, shareData.decimals)
          )
        )
      : undefined
  const prizeAssetPrice = prices[lower(prizeAssetData.address)]

  const tvl = parseFloat(formatUnits(assetData.amount, assetData.decimals)) * (assetPrice ?? 0)

  const bonusRewards = await getBonusRewardsInfo(vault, drawPeriod, prices, tvl)

  const share: Token & TokenWithPrice & Partial<TokenWithLogo> & { amount: string } = {
    chainId: shareData.chainId,
    address: shareData.address,
    symbol: shareData.symbol,
    name: vault.name ?? shareData.name,
    decimals: shareData.decimals,
    amount: shareData.totalSupply.toString(),
    logoURI: vault.logoURI,
    price: sharePrice
  }

  const asset: Token & TokenWithPrice & Partial<TokenWithLogo> & { amount: string } = {
    chainId: assetData.chainId,
    address: assetData.address,
    symbol: assetData.symbol,
    name: assetData.name,
    decimals: assetData.decimals,
    amount: assetData.amount.toString(),
    logoURI: vault.tokenLogoURI,
    price: assetPrice
  }

  const prizeAsset: Token & TokenWithPrice = {
    chainId: prizeAssetData.chainId,
    address: prizeAssetData.address,
    symbol: prizeAssetData.symbol,
    name: prizeAssetData.name,
    decimals: prizeAssetData.decimals,
    price: prizeAssetPrice
  }

  const yieldSource: { address: Address; name?: string; appURI?: string } = {
    address: yieldSourceAddress,
    name: vault.yieldSourceName,
    appURI: vault.yieldSourceURI
  }

  const contributions: { day: number; week: number; month: number; all: number } = {
    day: parseFloat(formatUnits(dailyContributions, prizeAsset.decimals)),
    week: parseFloat(formatUnits(weeklyContributions, prizeAsset.decimals)),
    month: parseFloat(formatUnits(monthlyContributions, prizeAsset.decimals)),
    all: parseFloat(formatUnits(allTimeContributions, prizeAsset.decimals))
  }

  const getPrizeYield = (numDraws: number, contributions: bigint, twab: bigint) => {
    if (!!prizeAsset.price && !!share.price) {
      const yearlyNumDraws = SECONDS_PER_YEAR / drawPeriod
      const extrapolatedYearlyContributions =
        parseFloat(formatUnits(contributions, prizeAsset.decimals)) * (yearlyNumDraws / numDraws)
      const extrapolatedYearlyContributionsValue =
        extrapolatedYearlyContributions * prizeAsset.price
      const twabTvl = parseFloat(formatUnits(twab, share.decimals)) * share.price
      return (extrapolatedYearlyContributionsValue / twabTvl) * 100
    }
  }
  const dailyPrizeYield = getPrizeYield(1, dailyContributions, dailySupplyTwab)
  const weeklyPrizeYield = getPrizeYield(
    Math.min(7, lastDrawId),
    weeklyContributions,
    weeklySupplyTwab
  )
  const monthlyPrizeYield = getPrizeYield(
    Math.min(30, lastDrawId),
    monthlyContributions,
    monthlySupplyTwab
  )
  const allTimePrizeYield = getPrizeYield(lastDrawId, allTimeContributions, allTimeSupplyTwab)

  const prizeYield: { day?: number; week?: number; month?: number; all?: number } = {
    day: dailyPrizeYield,
    week: weeklyPrizeYield,
    month: monthlyPrizeYield,
    all: allTimePrizeYield
  }

  return {
    share,
    asset,
    prizeAsset,
    tvl,
    yieldSource,
    owner,
    liquidationPair,
    claimer,
    yieldFees,
    contributions,
    prizeYield,
    bonusRewards
  }
}

const getBonusRewardsInfo = async (
  vault: Vault,
  drawPeriod: number,
  prices: Awaited<ReturnType<typeof getTokenPrices>>,
  tvl: number
): Promise<{ apr: number; tokens: TokenWithPrice[] }> => {
  const tokenAddresses = TWAB_REWARDS_SETTINGS[vault.chainId]?.tokenAddresses ?? []

  if (!tvl || !tokenAddresses.length) return { apr: 0, tokens: [] }

  const promotions = await getVaultPromotions(vault)

  const rewardTokens = await getTokenInfo(vault.publicClient, tokenAddresses)

  const yearlyDraws = SECONDS_PER_YEAR / drawPeriod
  const numDraws = 7
  const currentTimestamp = getSecondsSinceEpoch()
  const maxTimestamp = currentTimestamp + numDraws * drawPeriod

  const allTokenRewardsValue: { [tokenAddress: Address]: number } = {}
  let futureRewards = 0

  const getToken = (address: Address): TokenWithPrice => ({
    chainId: rewardTokens[address].chainId,
    address: rewardTokens[address].address,
    symbol: rewardTokens[address].symbol,
    name: rewardTokens[address].name,
    decimals: rewardTokens[address].decimals,
    price: prices[lower(address)]
  })

  tokenAddresses.forEach((tokenAddress) => {
    const rewardToken = getToken(tokenAddress)

    if (!!rewardToken.price && rewardToken.decimals !== undefined) {
      const matchingPromotions = Object.values(promotions).filter(
        (promotion) => lower(promotion.token) === lower(rewardToken.address)
      )

      matchingPromotions.forEach((promotion) => {
        const startsAt = Number(promotion.startTimestamp)
        const numberOfEpochs = promotion.numberOfEpochs ?? 0
        const epochDuration = promotion.epochDuration
        const endsAt = startsAt + numberOfEpochs * epochDuration
        const tokensPerEpoch = promotion.tokensPerEpoch

        if (
          !!startsAt &&
          startsAt < maxTimestamp &&
          endsAt > currentTimestamp &&
          startsAt !== endsAt
        ) {
          let numValidEpochs = 0

          for (let i = 0; i < numberOfEpochs; i++) {
            const epochEndsAt = startsAt + epochDuration * (i + 1)
            if (epochEndsAt > currentTimestamp && epochEndsAt < maxTimestamp) {
              numValidEpochs++
            }
          }

          const tokenRewards =
            parseFloat(formatUnits(tokensPerEpoch, rewardToken.decimals)) * numValidEpochs
          const tokenRewardsValue = tokenRewards * (rewardToken.price ?? 0)

          allTokenRewardsValue[tokenAddress] = tokenRewardsValue
          futureRewards += tokenRewardsValue
        }
      })
    }
  })

  const yearlyRewards = futureRewards * (yearlyDraws / numDraws)
  const apr = (yearlyRewards / tvl) * 100

  const promotionTokenAddresses = Object.entries(allTokenRewardsValue)
    .filter((entry) => !!entry[1])
    .sort((a, b) => b[1] - a[1])
    .map((entry) => entry[0] as Address)
  const promotionTokens = promotionTokenAddresses.map((tokenAddress) => getToken(tokenAddress))

  return { apr, tokens: promotionTokens }
}

const getVaultPromotions = async (vault: Vault) => {
  const promotions: { [id: string]: PartialPromotionInfo } = {}

  const promotionCreatedEvents = await getPromotionCreatedEvents(vault.publicClient, {
    vaultAddresses: [vault.address],
    tokenAddresses: TWAB_REWARDS_SETTINGS[vault.chainId]?.tokenAddresses,
    fromBlock: TWAB_REWARDS_SETTINGS[vault.chainId]?.fromBlock
  })

  const allPromotionInfo = await getPromotions(
    vault.publicClient,
    promotionCreatedEvents.map((e) => e.args.promotionId)
  )

  promotionCreatedEvents?.forEach((promotionCreatedEvent) => {
    const id = promotionCreatedEvent.args.promotionId.toString()
    promotions[id] = {
      startTimestamp: promotionCreatedEvent.args.startTimestamp,
      vault: promotionCreatedEvent.args.vault,
      epochDuration: promotionCreatedEvent.args.epochDuration,
      createdAtBlockNumber: promotionCreatedEvent.blockNumber,
      token: promotionCreatedEvent.args.token,
      tokensPerEpoch: promotionCreatedEvent.args.tokensPerEpoch,
      ...allPromotionInfo[id]
    }
  })

  return promotions
}
