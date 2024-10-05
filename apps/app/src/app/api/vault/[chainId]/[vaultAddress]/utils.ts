import { PrizePool, Vault } from '@generationsoftware/hyperstructure-client-js'
import { PartialPromotionInfo, TokenWithLogo, TokenWithPrice } from '@shared/types'
import {
  erc20ABI,
  getAssetsFromShares,
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
  chainId: NonNullable<ReturnType<typeof getChainIdFromParams>>,
  req: NextRequest
) => {
  const host = req.headers.get('host')
  const httpTransportConfig: HttpTransportConfig | undefined = !!host
    ? { fetchOptions: { headers: { Origin: `https://${host}` } } }
    : undefined

  return createPublicClient({
    chain: WAGMI_CHAINS[chainId],
    transport: http(RPC_URLS[chainId], httpTransportConfig)
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

export const getVaultData = async (vault: Vault, prizePool: PrizePool) => {
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
        args: [vault.address, zeroAddress, 1, lastDrawId]
      }
    ],
    batchSize
  })

  const dailyContributions = secondMulticallResults[0].result ?? 0n
  const weeklyContributions = secondMulticallResults[1].result ?? 0n
  const monthlyContributions = secondMulticallResults[2].result ?? 0n
  const allTimeContributions = secondMulticallResults[3].result ?? 0n
  const dailySupplyTwab = secondMulticallResults[4].result?.[1] ?? 0n
  const weeklySupplyTwab = secondMulticallResults[5].result?.[1] ?? 0n
  const monthlySupplyTwab = secondMulticallResults[6].result?.[1] ?? 0n
  const allTimeSupplyTwab = secondMulticallResults[7].result?.[1] ?? 0n

  const tokenAddresses: Address[] = [...TWAB_REWARDS_SETTINGS[vault.chainId]?.tokenAddresses]
  !!assetAddress && tokenAddresses.push(assetAddress)
  !!prizeAssetAddress && tokenAddresses.push(prizeAssetAddress)

  const prices = await getTokenPrices(vault.chainId, tokenAddresses)

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

  const bonusRewards =
    !!drawPeriod && tvl !== undefined
      ? await getBonusRewardsInfo(vault, drawPeriod, prices, tvl)
      : undefined

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

  const contributions: { day: number; week: number; month: number; all: number } | undefined =
    prizeAsset.decimals !== undefined
      ? {
          day: parseFloat(formatUnits(dailyContributions, prizeAsset.decimals)),
          week: parseFloat(formatUnits(weeklyContributions, prizeAsset.decimals)),
          month: parseFloat(formatUnits(monthlyContributions, prizeAsset.decimals)),
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

  const prizeYield: { day: number; week: number; month: number; all: number } = {
    day: getPrizeYield(1, dailyContributions, dailySupplyTwab),
    week: getPrizeYield(Math.min(7, lastDrawId), weeklyContributions, weeklySupplyTwab),
    month: getPrizeYield(Math.min(30, lastDrawId), monthlyContributions, monthlySupplyTwab),
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
