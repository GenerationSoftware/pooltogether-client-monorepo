import { PrizePool, Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  PartialPoolWidePromotionInfo,
  PartialPromotionInfo,
  TokenWithLogo,
  TokenWithPrice
} from '@shared/types'
import {
  erc20ABI,
  getAssetsFromShares,
  getPoolWidePromotionCreatedEvents,
  getPoolWidePromotions,
  getPoolWidePromotionVaultTokensPerEpoch,
  getPromotionCreatedEvents,
  getPromotions,
  getSecondsSinceEpoch,
  getTokenInfo,
  getTokenPrices,
  getVaultId,
  lower,
  PRIZE_POOLS,
  prizePoolABI,
  SECONDS_PER_YEAR,
  vaultABI
} from '@shared/utilities'
import { NextRequest } from 'next/server'
import {
  Address,
  createPublicClient,
  fallback,
  formatEther,
  formatUnits,
  http,
  HttpTransportConfig,
  isAddress,
  parseEther,
  parseUnits,
  PublicClient,
  zeroAddress
} from 'viem'
import {
  DEFAULT_VAULT_LISTS,
  RPC_URLS,
  TWAB_REWARDS_SETTINGS,
  WAGMI_CHAINS
} from '@constants/config'
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

export const getPublicClient = (
  req: NextRequest,
  chainId: NonNullable<ReturnType<typeof getChainIdFromParams>>
) => {
  const host = req.headers.get('host')
  const httpTransportConfig: HttpTransportConfig | undefined = !!host
    ? { fetchOptions: { headers: { Origin: `https://${host}` } } }
    : undefined

  return createPublicClient({
    chain: WAGMI_CHAINS[chainId],
    transport: fallback([
      http(RPC_URLS[chainId], httpTransportConfig),
      http(undefined, httpTransportConfig)
    ])
  }) as PublicClient
}

export const getVault = (
  chainId: NonNullable<ReturnType<typeof getChainIdFromParams>>,
  address: Address,
  publicClient: PublicClient
) => {
  const existingVaultInfo = Object.values(DEFAULT_VAULT_LISTS)
    .map((list) => list.tokens)
    .flat()
    .find((t) => getVaultId(t) === getVaultId({ chainId, address }))

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

export const getVaultData = async (req: NextRequest, vault: Vault, prizePool: PrizePool) => {
  const batchSize = 1_024 * 1_024

  const firstMulticallResults = await vault.publicClient.multicall({
    contracts: [
      { address: vault.address, abi: vaultABI, functionName: 'asset' },
      { address: vault.address, abi: erc20ABI, functionName: 'symbol' },
      { address: vault.address, abi: erc20ABI, functionName: 'name' },
      { address: vault.address, abi: erc20ABI, functionName: 'decimals' },
      { address: vault.address, abi: erc20ABI, functionName: 'totalSupply' },
      { address: vault.address, abi: vaultABI, functionName: 'totalPreciseAssets' },
      { address: vault.address, abi: vaultABI, functionName: 'totalAssets' },
      { address: vault.address, abi: vaultABI, functionName: 'yieldVault' },
      { address: vault.address, abi: vaultABI, functionName: 'owner' },
      { address: vault.address, abi: vaultABI, functionName: 'liquidationPair' },
      { address: vault.address, abi: vaultABI, functionName: 'claimer' },
      { address: vault.address, abi: vaultABI, functionName: 'yieldFeePercentage' },
      { address: vault.address, abi: vaultABI, functionName: 'yieldFeeRecipient' },
      { address: prizePool.address, abi: prizePoolABI, functionName: 'prizeToken' },
      { address: prizePool.address, abi: prizePoolABI, functionName: 'getLastAwardedDrawId' },
      { address: prizePool.address, abi: prizePoolABI, functionName: 'drawPeriodSeconds' }
    ],
    batchSize
  })

  const assetAddress = firstMulticallResults[0].result
  const shareSymbol = firstMulticallResults[1].result
  const shareName = firstMulticallResults[2].result
  const shareDecimals = firstMulticallResults[3].result
  const shareTotalSupply = firstMulticallResults[4].result
  const totalAssets = firstMulticallResults[5].result ?? firstMulticallResults[6].result
  const yieldSourceAddress = firstMulticallResults[7].result
  const owner = firstMulticallResults[8].result
  const liquidationPair = firstMulticallResults[9].result
  const claimer = firstMulticallResults[10].result
  const yieldFeePercentage = firstMulticallResults[11].result ?? 0
  const yieldFeeRecipient = firstMulticallResults[12].result ?? zeroAddress
  const prizeAssetAddress = firstMulticallResults[13].result
  const lastDrawId = firstMulticallResults[14].result || 1
  const drawPeriod = firstMulticallResults[15].result

  let assetSymbol: string | undefined = undefined
  let assetName: string | undefined = undefined
  let assetDecimals: number | undefined = undefined

  if (!!assetAddress) {
    const assetMulticallResults = await vault.publicClient.multicall({
      contracts: [
        { address: assetAddress, abi: erc20ABI, functionName: 'symbol' },
        { address: assetAddress, abi: erc20ABI, functionName: 'name' },
        { address: assetAddress, abi: erc20ABI, functionName: 'decimals' }
      ],
      batchSize
    })

    assetSymbol = assetMulticallResults[0].result
    assetName = assetMulticallResults[1].result
    assetDecimals = assetMulticallResults[2].result
  }

  let exchangeRate: bigint | undefined = undefined

  if (shareDecimals !== undefined) {
    exchangeRate = await vault.publicClient.readContract({
      address: vault.address,
      abi: vaultABI,
      functionName: 'convertToAssets',
      args: [parseUnits('1', shareDecimals)]
    })
  }

  let prizeAssetSymbol: string | undefined = undefined
  let prizeAssetName: string | undefined = undefined
  let prizeAssetDecimals: number | undefined = undefined

  if (!!prizeAssetAddress) {
    const prizeAssetMulticallResults = await vault.publicClient.multicall({
      contracts: [
        { address: prizeAssetAddress, abi: erc20ABI, functionName: 'symbol' },
        { address: prizeAssetAddress, abi: erc20ABI, functionName: 'name' },
        { address: prizeAssetAddress, abi: erc20ABI, functionName: 'decimals' }
      ],
      batchSize
    })

    prizeAssetSymbol = prizeAssetMulticallResults[0].result
    prizeAssetName = prizeAssetMulticallResults[1].result
    prizeAssetDecimals = prizeAssetMulticallResults[2].result
  }

  const secondMulticallResults = await vault.publicClient.multicall({
    contracts: [
      {
        address: prizePool.address,
        abi: prizePoolABI,
        functionName: 'getContributedBetween',
        args: [vault.address, lastDrawId, lastDrawId]
      },
      {
        address: prizePool.address,
        abi: prizePoolABI,
        functionName: 'getContributedBetween',
        args: [vault.address, Math.max(1, lastDrawId - 2), lastDrawId]
      },
      {
        address: prizePool.address,
        abi: prizePoolABI,
        functionName: 'getContributedBetween',
        args: [vault.address, Math.max(1, lastDrawId - 6), lastDrawId]
      },
      {
        address: prizePool.address,
        abi: prizePoolABI,
        functionName: 'getContributedBetween',
        args: [vault.address, Math.max(1, lastDrawId - 29), lastDrawId]
      },
      {
        address: prizePool.address,
        abi: prizePoolABI,
        functionName: 'getContributedBetween',
        args: [vault.address, Math.max(1, lastDrawId - 89), lastDrawId]
      },
      {
        address: prizePool.address,
        abi: prizePoolABI,
        functionName: 'getContributedBetween',
        args: [vault.address, 1, lastDrawId]
      },
      {
        address: prizePool.address,
        abi: prizePoolABI,
        functionName: 'getVaultUserBalanceAndTotalSupplyTwab',
        args: [vault.address, zeroAddress, lastDrawId, lastDrawId]
      },
      {
        address: prizePool.address,
        abi: prizePoolABI,
        functionName: 'getVaultUserBalanceAndTotalSupplyTwab',
        args: [vault.address, zeroAddress, Math.max(1, lastDrawId - 2), lastDrawId]
      },
      {
        address: prizePool.address,
        abi: prizePoolABI,
        functionName: 'getVaultUserBalanceAndTotalSupplyTwab',
        args: [vault.address, zeroAddress, Math.max(1, lastDrawId - 6), lastDrawId]
      },
      {
        address: prizePool.address,
        abi: prizePoolABI,
        functionName: 'getVaultUserBalanceAndTotalSupplyTwab',
        args: [vault.address, zeroAddress, Math.max(1, lastDrawId - 29), lastDrawId]
      },
      {
        address: prizePool.address,
        abi: prizePoolABI,
        functionName: 'getVaultUserBalanceAndTotalSupplyTwab',
        args: [vault.address, zeroAddress, Math.max(1, lastDrawId - 89), lastDrawId]
      },
      {
        address: prizePool.address,
        abi: prizePoolABI,
        functionName: 'getVaultUserBalanceAndTotalSupplyTwab',
        args: [vault.address, zeroAddress, 1, lastDrawId]
      }
    ],
    batchSize
  })

  const lastDrawContributions = secondMulticallResults[0].result ?? 0n
  const last3DrawContributions = secondMulticallResults[1].result ?? 0n
  const last7DrawContributions = secondMulticallResults[2].result ?? 0n
  const last30DrawContributions = secondMulticallResults[3].result ?? 0n
  const last90DrawContributions = secondMulticallResults[4].result ?? 0n
  const allTimeContributions = secondMulticallResults[5].result ?? 0n
  const lastDrawSupplyTwab = secondMulticallResults[6].result?.[1] ?? 0n
  const last3DrawSupplyTwab = secondMulticallResults[7].result?.[1] ?? 0n
  const last7DrawSupplyTwab = secondMulticallResults[8].result?.[1] ?? 0n
  const last30DrawSupplyTwab = secondMulticallResults[9].result?.[1] ?? 0n
  const last90DrawSupplyTwab = secondMulticallResults[10].result?.[1] ?? 0n
  const allTimeSupplyTwab = secondMulticallResults[11].result?.[1] ?? 0n

  const tokenAddresses: Address[] = [...TWAB_REWARDS_SETTINGS[vault.chainId]?.tokenAddresses]
  !!assetAddress && tokenAddresses.push(assetAddress)
  !!prizeAssetAddress && tokenAddresses.push(prizeAssetAddress)

  const host = req.headers.get('host')
  const prices = await getTokenPrices(vault.chainId, tokenAddresses, {
    requestHeaders: { Referer: `https://${host}` }
  })

  const asset: Partial<TokenWithPrice & TokenWithLogo & { amount: number }> | undefined =
    !!assetAddress
      ? {
          chainId: vault.chainId,
          address: assetAddress,
          symbol: assetSymbol,
          name: assetName,
          decimals: assetDecimals,
          amount:
            totalAssets !== undefined && assetDecimals !== undefined
              ? parseFloat(formatUnits(totalAssets, assetDecimals))
              : undefined,
          logoURI: vault.tokenLogoURI,
          price: !!assetAddress ? prices[lower(assetAddress)] : undefined
        }
      : undefined

  const share: Partial<TokenWithPrice & TokenWithLogo & { amount: number }> = {
    chainId: vault.chainId,
    address: vault.address,
    symbol: shareSymbol,
    name: vault.name ?? shareName,
    decimals: shareDecimals,
    amount:
      shareTotalSupply !== undefined && shareDecimals !== undefined
        ? parseFloat(formatUnits(shareTotalSupply, shareDecimals))
        : undefined,
    logoURI: vault.logoURI,
    price:
      asset?.price !== undefined && !!exchangeRate && shareDecimals !== undefined
        ? parseFloat(
            formatEther(
              getAssetsFromShares(parseEther(asset.price.toFixed(18)), exchangeRate, shareDecimals)
            )
          )
        : undefined
  }

  const prizeAsset: Partial<TokenWithPrice> = {
    chainId: vault.chainId,
    address: prizeAssetAddress,
    symbol: prizeAssetSymbol,
    name: prizeAssetName,
    decimals: prizeAssetDecimals,
    price: !!prizeAssetAddress ? prices[lower(prizeAssetAddress)] : undefined
  }

  const tvl = asset?.amount !== undefined ? asset.amount * (asset.price ?? 0) : undefined

  const bonusRewards = await getBonusRewardsInfo(vault, share, prices)

  const yieldSource: { address: Address; name?: string; appURI?: string } | undefined =
    !!yieldSourceAddress
      ? {
          address: yieldSourceAddress,
          name: vault.yieldSourceName,
          appURI: vault.yieldSourceURI
        }
      : undefined

  const yieldFees: { percent: number; recipient: Address } = {
    percent: yieldFeePercentage,
    recipient: yieldFeeRecipient
  }

  const contributions:
    | { lastXDraws: { 1: number; 3: number; 7: number; 30: number; 90: number }; all: number }
    | undefined =
    prizeAsset.decimals !== undefined
      ? {
          lastXDraws: {
            1: parseFloat(formatUnits(lastDrawContributions, prizeAsset.decimals)),
            3: parseFloat(formatUnits(last3DrawContributions, prizeAsset.decimals)),
            7: parseFloat(formatUnits(last7DrawContributions, prizeAsset.decimals)),
            30: parseFloat(formatUnits(last30DrawContributions, prizeAsset.decimals)),
            90: parseFloat(formatUnits(last90DrawContributions, prizeAsset.decimals))
          },
          all: parseFloat(formatUnits(allTimeContributions, prizeAsset.decimals))
        }
      : undefined

  const getPrizeYield = (numDraws: number, contributions: bigint, twab: bigint) => {
    if (
      !!drawPeriod &&
      prizeAsset.decimals !== undefined &&
      share.decimals !== undefined &&
      !!prizeAsset.price &&
      !!share.price &&
      !!twab
    ) {
      const yearlyNumDraws = SECONDS_PER_YEAR / drawPeriod
      const extrapolatedYearlyContributions =
        parseFloat(formatUnits(contributions, prizeAsset.decimals)) * (yearlyNumDraws / numDraws)
      const extrapolatedYearlyContributionsValue =
        extrapolatedYearlyContributions * prizeAsset.price
      const twabTvl = parseFloat(formatUnits(twab, share.decimals)) * share.price

      return (extrapolatedYearlyContributionsValue / twabTvl) * 100
    } else {
      return 0
    }
  }

  const prizeYield: {
    lastXDraws: {
      1: number
      3: number
      7: number
      30: number
      90: number
    }
    all: number
  } = {
    lastXDraws: {
      1: getPrizeYield(1, lastDrawContributions, lastDrawSupplyTwab),
      3: getPrizeYield(Math.min(3, lastDrawId), last3DrawContributions, last3DrawSupplyTwab),
      7: getPrizeYield(Math.min(7, lastDrawId), last7DrawContributions, last7DrawSupplyTwab),
      30: getPrizeYield(Math.min(30, lastDrawId), last30DrawContributions, last30DrawSupplyTwab),
      90: getPrizeYield(Math.min(90, lastDrawId), last90DrawContributions, last90DrawSupplyTwab)
    },
    all: getPrizeYield(lastDrawId, allTimeContributions, allTimeSupplyTwab)
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
    drawPeriod,
    yieldFees,
    contributions,
    prizeYield,
    bonusRewards
  }
}

const getBonusRewardsInfo = async (
  vault: Vault,
  share: { decimals?: number; price?: number },
  prices: Awaited<ReturnType<typeof getTokenPrices>>
): Promise<{ apr: number; tokens: TokenWithPrice[] }> => {
  const tokenAddresses = TWAB_REWARDS_SETTINGS[vault.chainId]?.tokenAddresses ?? []

  if (share.decimals === undefined || !share.price || !tokenAddresses.length) {
    return { apr: 0, tokens: [] }
  }

  const promotions = await getVaultPromotions(vault)
  const poolWidePromotions = await getPoolWideVaultPromotions(vault)

  if (!Object.keys(promotions).length && !Object.keys(poolWidePromotions).length) {
    return { apr: 0, tokens: [] }
  }

  const rewardTokens = await getTokenInfo(vault.publicClient, tokenAddresses)

  if (!Object.keys(rewardTokens).length) {
    return { apr: 0, tokens: [] }
  }

  const totalDelegateSupply = await vault.getTotalDelegateSupply()

  const currentTimestamp = getSecondsSinceEpoch()
  const tvl = parseFloat(formatUnits(totalDelegateSupply, share.decimals)) * share.price

  const relevantTokenAddresses = new Set<Address>()
  let apr = 0

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
        const rewardsApr = calculateRewardsApr(promotion, rewardToken, tvl, { currentTimestamp })

        if (!!rewardsApr) {
          apr += rewardsApr
          relevantTokenAddresses.add(rewardToken.address)
        }
      })

      const matchingPoolWidePromotions = Object.values(poolWidePromotions).filter(
        (promotion) => lower(promotion.token) === lower(rewardToken.address)
      )

      matchingPoolWidePromotions.forEach((promotion) => {
        const rewardsApr = calculatePoolWideRewardsApr(promotion, rewardToken, tvl, {
          currentTimestamp
        })

        if (!!rewardsApr) {
          apr += rewardsApr
          relevantTokenAddresses.add(rewardToken.address)
        }
      })
    }
  })

  const promotionTokens = [...relevantTokenAddresses].map((tokenAddress) => getToken(tokenAddress))

  return { apr, tokens: promotionTokens }
}

const getVaultPromotions = async (vault: Vault) => {
  const promotions: { [id: string]: PartialPromotionInfo } = {}

  try {
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
  } catch {}

  return promotions
}

const getPoolWideVaultPromotions = async (vault: Vault) => {
  const promotions: { [id: string]: PartialPoolWidePromotionInfo } = {}

  try {
    const poolWidePromotionCreatedEvents = await getPoolWidePromotionCreatedEvents(
      vault.publicClient,
      {
        tokenAddresses: TWAB_REWARDS_SETTINGS[vault.chainId]?.tokenAddresses,
        fromBlock: TWAB_REWARDS_SETTINGS[vault.chainId]?.fromBlock
      }
    )

    const allPromotionInfo = await getPoolWidePromotions(
      vault.publicClient,
      poolWidePromotionCreatedEvents.map((e) => e.args.promotionId)
    )

    const allVaultTokensPerEpoch = await getPoolWidePromotionVaultTokensPerEpoch(
      vault.publicClient,
      vault.address,
      allPromotionInfo
    )

    poolWidePromotionCreatedEvents?.forEach((promotionCreatedEvent) => {
      const id = promotionCreatedEvent.args.promotionId.toString()
      const vaultTokensPerEpoch = allVaultTokensPerEpoch[id] ?? []

      if (vaultTokensPerEpoch.some((entry) => !!entry)) {
        promotions[id] = {
          startTimestamp: BigInt(promotionCreatedEvent.args.startTimestamp),
          vault: vault.address,
          epochDuration: promotionCreatedEvent.args.epochDuration,
          createdAtBlockNumber: promotionCreatedEvent.blockNumber,
          token: promotionCreatedEvent.args.token,
          tokensPerEpoch: promotionCreatedEvent.args.tokensPerEpoch,
          vaultTokensPerEpoch: allVaultTokensPerEpoch[id] ?? [],
          ...allPromotionInfo[id]
        }
      }
    })
  } catch {}

  return promotions
}

const calculateRewardsApr = (
  promotion: PartialPromotionInfo,
  rewardToken: TokenWithPrice,
  tvl: number,
  options?: { currentTimestamp?: number }
) => {
  const startsAt = Number(promotion.startTimestamp)
  const numberOfEpochs = promotion.numberOfEpochs ?? 0
  const endsAt = startsAt + numberOfEpochs * promotion.epochDuration

  const currentTimestamp = options?.currentTimestamp ?? getSecondsSinceEpoch()

  if (
    !!startsAt &&
    !!numberOfEpochs &&
    !!endsAt &&
    startsAt < currentTimestamp &&
    endsAt > currentTimestamp
  ) {
    for (let i = 0; i < numberOfEpochs; i++) {
      const epochStartsAt = startsAt + promotion.epochDuration * i
      const epochEndsAt = epochStartsAt + promotion.epochDuration

      if (epochStartsAt < currentTimestamp && epochEndsAt > currentTimestamp) {
        const tokenRewards = parseFloat(formatUnits(promotion.tokensPerEpoch, rewardToken.decimals))

        const tokenRewardsValue = tokenRewards * (rewardToken.price ?? 0)
        const yearlyRewardsValue = tokenRewardsValue * (SECONDS_PER_YEAR / promotion.epochDuration)

        return (yearlyRewardsValue / tvl) * 100
      }
    }
  }

  return 0
}

const calculatePoolWideRewardsApr = (
  promotion: PartialPoolWidePromotionInfo,
  rewardToken: TokenWithPrice,
  tvl: number,
  options?: { currentTimestamp?: number }
) => {
  const startsAt = Number(promotion.startTimestamp)
  const numberOfEpochs = promotion.numberOfEpochs ?? 0
  const endsAt = startsAt + numberOfEpochs * promotion.epochDuration

  const currentTimestamp = options?.currentTimestamp ?? getSecondsSinceEpoch()

  if (
    !!startsAt &&
    !!numberOfEpochs &&
    !!endsAt &&
    startsAt < currentTimestamp &&
    endsAt > currentTimestamp
  ) {
    // TODO: consider a limited timespan to avoid lagging apr during long-lasting promotions
    const tokenRewards = parseFloat(
      formatUnits(
        promotion.vaultTokensPerEpoch.reduce((a, b) => a + b),
        rewardToken.decimals
      )
    )

    const tokenRewardsValue = tokenRewards * (rewardToken.price ?? 0)
    const yearlyRewardsValue =
      tokenRewardsValue *
      (SECONDS_PER_YEAR / (promotion.epochDuration * promotion.vaultTokensPerEpoch.length))

    return (yearlyRewardsValue / tvl) * 100
  }

  return 0
}
