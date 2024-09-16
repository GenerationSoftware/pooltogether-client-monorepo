import { ContractFunctionParameters, createPublicClient, formatUnits, http } from 'viem'
import {
  RPC_URLS,
  USD_PRICE_REF,
  V5_NETWORKS,
  V5_PRIZE_TOKEN_PRICE_REF,
  V5_VAULT_ABI,
  VIEM_CHAINS
} from './constants'
import { getTokenPrices } from './prices'
import {
  getPaginatedV5SubgraphPrizeData,
  getPaginatedV5SubgraphUserData,
  getPaginatedV5SubgraphVaultData
} from './subgraphs'
import { ProtocolStats } from './types'

export const getV5Stats = async (): Promise<ProtocolStats> => {
  let users = 0
  let tvlEth = 0
  let awardedEth = 0

  await Promise.all(
    V5_NETWORKS.map(async (network) => {
      const networkUsers = await getUserCount(network)
      const networkTvlEth = await getTvl(network)
      const networkAwardedEth = await getPrizesAwarded(network)

      users += networkUsers
      tvlEth += networkTvlEth
      awardedEth += networkAwardedEth
    })
  )

  const usdTokenPrice = (await getTokenPrices(USD_PRICE_REF.chainId, [USD_PRICE_REF.address]))?.[
    USD_PRICE_REF.address
  ]

  const tvl = { eth: tvlEth, usd: tvlEth / usdTokenPrice }
  const awarded = { eth: awardedEth, usd: awardedEth / usdTokenPrice }

  return { current: { users, tvl }, awarded }
}

const getUserCount = async (chainId: (typeof V5_NETWORKS)[number]) => {
  const userData = await getPaginatedV5SubgraphUserData(chainId)
  return userData.length
}

const getTvl = async (chainId: (typeof V5_NETWORKS)[number]) => {
  let tvl = 0

  const vaultData = await getPaginatedV5SubgraphVaultData(chainId)

  const vaultAddresses = vaultData.map((vault) => vault.address)
  const tokenData = await getV5VaultTokenData(chainId, vaultAddresses)

  const tokenAddresses = tokenData
    .map((token) => token?.address)
    .filter((address) => !!address) as `0x${string}`[]
  const tokenPrices = await getTokenPrices(chainId, tokenAddresses)

  tokenData.forEach((token) => {
    if (!!token) {
      const tokenAddress = token.address.toLowerCase() as Lowercase<`0x${string}`>
      const tokenPrice = tokenPrices[tokenAddress]

      if (!!tokenPrice) {
        const tokenBalance = parseFloat(formatUnits(token.balance, token.decimals))
        tvl += tokenBalance * tokenPrice
      }
    }
  })

  return tvl
}

const getPrizesAwarded = async (chainId: (typeof V5_NETWORKS)[number]) => {
  let totalPrizesAwarded = 0

  const prizeData = await getPaginatedV5SubgraphPrizeData(chainId)

  if (!!prizeData.length) {
    const prizeTokenPriceRef = V5_PRIZE_TOKEN_PRICE_REF[chainId]

    const prizeTokenPrice = (
      await getTokenPrices(prizeTokenPriceRef.chainId, [prizeTokenPriceRef.address])
    )?.[prizeTokenPriceRef.address]

    if (!!prizeTokenPrice) {
      prizeData.forEach((prize) => {
        const prizeAmount = parseFloat(formatUnits(prize.payout, prizeTokenPriceRef.decimals))
        totalPrizesAwarded += prizeAmount * prizeTokenPrice
      })
    }
  }

  return totalPrizesAwarded
}

const getV5VaultTokenData = async (
  chainId: (typeof V5_NETWORKS)[number],
  vaultAddresses: `0x${string}`[]
) => {
  const tokenData: ({ address: `0x${string}`; balance: bigint; decimals: number } | undefined)[] =
    []

  if (!!vaultAddresses.length) {
    const publicClient = createPublicClient({
      chain: VIEM_CHAINS[chainId],
      transport: http(RPC_URLS[chainId])
    })

    const contracts: ContractFunctionParameters<typeof V5_VAULT_ABI>[] = []
    vaultAddresses.forEach((address) =>
      contracts.push(
        { address, abi: V5_VAULT_ABI, functionName: 'asset' },
        { address, abi: V5_VAULT_ABI, functionName: 'totalAssets' },
        { address, abi: V5_VAULT_ABI, functionName: 'decimals' }
      )
    )

    const results = await publicClient.multicall({ contracts })

    for (let i = 0; i < vaultAddresses.length; i++) {
      const address = results[i * 3]?.result as `0x${string}` | undefined
      const balance = results[i * 3 + 1]?.result as bigint | undefined
      const decimals = results[i * 3 + 2]?.result as number | undefined

      if (!!address && balance !== undefined && decimals !== undefined) {
        tokenData.push({ address, balance, decimals })
      } else {
        tokenData.push(undefined)
      }
    }
  }

  return tokenData
}
