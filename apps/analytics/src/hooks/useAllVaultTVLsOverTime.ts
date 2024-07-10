import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import {
  useAllVaultExchangeRates,
  useDrawPeriod,
  useFirstDrawOpenedAt
} from '@generationsoftware/hyperstructure-react-hooks'
import { getAssetsFromShares, lower } from '@shared/utilities'
import { useMemo } from 'react'
import { formatUnits } from 'viem'
import { useAllVaultSupplyTwabsOverTime } from '@hooks/useAllVaultSupplyTwabsOverTime'
import { useAllVaultsWithHistoricalPrices } from '@hooks/useAllVaultsWithHistoricalPrices'

export const useAllVaultTVLsOverTime = (prizePool: PrizePool) => {
  const {
    vaults,
    vaultTokens,
    vaultHistoricalTokenPrices,
    isFetched: isFetchedVaults
  } = useAllVaultsWithHistoricalPrices(prizePool)

  const { data: vaultSupplyTwabs, isFetched: isFetchedVaultSupplyTwabs } =
    useAllVaultSupplyTwabsOverTime(prizePool, vaults.vaultAddresses[prizePool.chainId])

  const { data: vaultExchangeRates, isFetched: isFetchedVaultExchangeRates } =
    useAllVaultExchangeRates(vaults)

  const { data: firstDrawOpenedAt, isFetched: isFetchedFirstDrawOpenedAt } =
    useFirstDrawOpenedAt(prizePool)

  const { data: drawPeriod, isFetched: isFetchedDrawPeriod } = useDrawPeriod(prizePool)

  const isFetched =
    isFetchedVaults &&
    isFetchedVaultSupplyTwabs &&
    isFetchedVaultExchangeRates &&
    isFetchedFirstDrawOpenedAt &&
    isFetchedDrawPeriod

  const data = useMemo(() => {
    if (isFetched) {
      const vaultTvls: { [vaultId: string]: { drawId: number; tvl: number }[] } = {}

      if (
        !!vaultSupplyTwabs &&
        !!vaultTokens &&
        !!vaultExchangeRates &&
        !!firstDrawOpenedAt &&
        !!drawPeriod
      ) {
        Object.entries(vaultSupplyTwabs).forEach(([vaultId, supplyTwabs]) => {
          if (supplyTwabs.some((entry) => !!entry.supplyTwab)) {
            const token = vaultTokens[vaultId]
            const tokenPricesEntry = !!token
              ? Object.entries(vaultHistoricalTokenPrices).find(
                  (entry) => lower(entry[0]) === lower(token.address)
                )
              : undefined
            const tokenPrices = tokenPricesEntry?.[1]
            const exchangeRate = vaultExchangeRates[vaultId]

            if (!!token && !!tokenPrices?.length && !!exchangeRate) {
              supplyTwabs.forEach(({ drawId, supplyTwab }) => {
                const assetAmount = getAssetsFromShares(supplyTwab, exchangeRate, token.decimals)
                const assetPrice = getTokenHistoricalPrice(
                  tokenPrices,
                  drawId,
                  firstDrawOpenedAt,
                  drawPeriod
                )

                if (!!assetPrice) {
                  const tvl = parseFloat(formatUnits(assetAmount, token.decimals)) * assetPrice

                  if (vaultTvls[vaultId] === undefined) {
                    vaultTvls[vaultId] = []
                  }

                  vaultTvls[vaultId].push({ drawId, tvl })
                }
              })
            }
          }
        })
      }

      return vaultTvls
    }
  }, [
    vaultHistoricalTokenPrices,
    vaultSupplyTwabs,
    vaultTokens,
    vaultExchangeRates,
    firstDrawOpenedAt,
    drawPeriod,
    isFetched
  ])

  return { data, isFetched }
}

const getTokenHistoricalPrice = (
  historicalPrices: { date: string; price: number }[],
  drawId: number,
  firstDrawOpenedAt: number,
  drawPeriod: number
) => {
  const drawTimestamp = firstDrawOpenedAt + drawPeriod * drawId

  let bestEntry = { timeDiff: Number.MAX_SAFE_INTEGER, price: 0 }
  historicalPrices.forEach((entry) => {
    const timestamp = new Date(entry.date).getTime() / 1e3
    const timeDiff = Math.abs(drawTimestamp - timestamp)

    if (timeDiff < bestEntry.timeDiff) {
      bestEntry.timeDiff = timeDiff
      bestEntry.price = entry.price
    }
  })

  return bestEntry.price
}
