import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { useDepositEvents } from '@generationsoftware/hyperstructure-react-hooks'
import { TokenWithAmount, TokenWithPrice, TokenWithSupply } from '@shared/types'
import { getVaultId, lower } from '@shared/utilities'
import { useMemo } from 'react'
import { Address, formatUnits } from 'viem'
import { QUERY_START_BLOCK } from '@constants/config'
import { useAllVaultsWithHistoricalPrices } from '@hooks/useAllVaultsWithHistoricalPrices'
import { useRngTxs } from './useRngTxs'

export const useDeposits = (prizePool: PrizePool) => {
  const {
    vaults,
    vaultTokens,
    vaultHistoricalTokenPrices,
    isFetched: isFetchedVaults
  } = useAllVaultsWithHistoricalPrices(prizePool)

  const { data: depositEvents, isFetched: isFetchedDepositEvents } = useDepositEvents(
    prizePool.chainId,
    vaults.vaultAddresses[prizePool.chainId],
    { fromBlock: QUERY_START_BLOCK[prizePool.chainId] }
  )

  const { data: rngTxs, isFetched: isFetchedRngTxs } = useRngTxs(prizePool)

  const isFetched = isFetchedVaults && isFetchedDepositEvents && !!depositEvents && isFetchedRngTxs

  const data = useMemo(() => {
    if (isFetched) {
      const list: {
        vaultId: string
        vaultAddress: Address
        token: TokenWithSupply & TokenWithAmount & TokenWithPrice & { value: number }
        event: NonNullable<ReturnType<typeof useDepositEvents>['data']>[number]
      }[] = []
      let numValues = 0
      let sumValues = 0

      depositEvents.forEach((event) => {
        const vaultId = getVaultId({ chainId: prizePool.chainId, address: event.address })
        const tokenData = vaultTokens[vaultId]
        const tokenAmount = event.args.assets
        const tokenPrices = vaultHistoricalTokenPrices[lower(tokenData.address)]
        const tokenPrice = getTokenHistoricalPrice(tokenPrices, rngTxs, event.blockNumber)
        const tokenValue = parseFloat(formatUnits(tokenAmount, tokenData.decimals)) * tokenPrice

        list.push({
          vaultId,
          vaultAddress: event.address,
          token: { ...tokenData, amount: tokenAmount, price: tokenPrice, value: tokenValue },
          event
        })

        if (!!tokenValue) {
          numValues++
          sumValues += tokenValue
        }
      })

      const avgValue = numValues > 0 ? sumValues / numValues : 0

      const sortedValues = [...list]
        .filter((d) => !!d.token.value)
        .sort((a, b) => a.token.value - b.token.value)
      const middleIndex = Math.floor(sortedValues.length / 2)
      const medianValue =
        sortedValues.length > 0
          ? sortedValues.length % 2
            ? sortedValues[middleIndex].token.value
            : (sortedValues[middleIndex - 1].token.value + sortedValues[middleIndex].token.value) /
              2
          : 0

      return { list, avgValue, medianValue }
    }
  }, [depositEvents, vaultTokens, vaultHistoricalTokenPrices, rngTxs, isFetched])

  return { data, isFetched }
}

const getTokenHistoricalPrice = (
  historicalPrices: { date: string; price: number }[],
  rngTxs?: NonNullable<ReturnType<typeof useRngTxs>['data']>,
  blockNumber?: bigint
) => {
  if (!rngTxs || !blockNumber) {
    return historicalPrices[0].price
  }

  let bestRngTx = { blockDiff: -1n, timestamp: 0 }

  rngTxs.forEach(({ drawStart: [tx] }) => {
    if (!!tx.blockNumber && !!tx.timestamp) {
      const blockDiff =
        tx.blockNumber - blockNumber < 0n
          ? blockNumber - tx.blockNumber
          : tx.blockNumber - blockNumber

      if (bestRngTx.blockDiff === -1n || blockDiff < bestRngTx.blockDiff) {
        bestRngTx.blockDiff = blockDiff
        bestRngTx.timestamp = tx.timestamp
      }
    }
  })

  let bestEntry = { timeDiff: Number.MAX_SAFE_INTEGER, price: 0 }

  if (!!bestRngTx.timestamp) {
    historicalPrices.forEach((entry) => {
      const entryTimestamp = new Date(entry.date).getTime() / 1e3
      const timeDiff = Math.abs(bestRngTx.timestamp - entryTimestamp)

      if (timeDiff < bestEntry.timeDiff) {
        bestEntry.timeDiff = timeDiff
        bestEntry.price = entry.price
      }
    })
  }

  return bestEntry.price
}
