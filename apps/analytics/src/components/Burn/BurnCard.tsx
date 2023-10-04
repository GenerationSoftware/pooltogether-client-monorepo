import { Token } from '@shared/types'
import { Spinner } from '@shared/ui'
import {
  DEAD_ADDRESS,
  formatBigIntForDisplay,
  MAX_UINT_256,
  SECONDS_PER_HOUR
} from '@shared/utilities'
import classNames from 'classnames'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'
import { currentTimestampAtom } from 'src/atoms'
import { Address, Block, Log } from 'viem'
import { BURN_ADDRESSES, QUERY_START_BLOCK, VAULT_LPS } from '@constants/config'
import { useTransferEvents } from '@hooks/useTransferEvents'

interface BurnCardProps {
  prizeToken: Token
  minBlock?: Block
  maxBlock?: Block
  className?: string
}

export const BurnCard = (props: BurnCardProps) => {
  const { prizeToken, minBlock, maxBlock, className } = props

  const currentTimestamp = useAtomValue(currentTimestampAtom)

  const lpAddresses = VAULT_LPS[prizeToken.chainId] ?? []
  const miscBurnAddresses = BURN_ADDRESSES[prizeToken.chainId] ?? []

  const { data: burnEvents } = useTransferEvents(prizeToken.chainId, prizeToken.address, {
    to: [...lpAddresses, ...miscBurnAddresses, DEAD_ADDRESS],
    fromBlock: QUERY_START_BLOCK[prizeToken.chainId]
  })

  const isValidEvent = (event?: Log<bigint, number, false> | { blockNumber: bigint }) => {
    return (
      !!event &&
      event.blockNumber >= (minBlock?.number ?? 0n) &&
      event.blockNumber <= (maxBlock?.number ?? MAX_UINT_256)
    )
  }

  const burnAmounts = useMemo(() => {
    if (!!burnEvents) {
      let lp = 0n
      let manual = 0n
      let other = 0n

      burnEvents.forEach((event) => {
        if (isValidEvent(event)) {
          const toAddress = event.args.to.toLowerCase() as Lowercase<Address>

          if (lpAddresses.includes(toAddress)) {
            lp += event.args.value
          } else if (toAddress === DEAD_ADDRESS) {
            manual += event.args.value
          } else {
            other += event.args.value
          }
        }
      })

      return { lp, manual, other }
    }
  }, [burnEvents, minBlock, maxBlock])

  if (!prizeToken || !burnAmounts) {
    return <Spinner className='after:border-y-pt-purple-800' />
  }

  const minTimestamp = Number(minBlock?.timestamp ?? 0)
  const maxTimestamp = Number(maxBlock?.timestamp ?? currentTimestamp)
  const hours = Math.round((maxTimestamp - minTimestamp) / SECONDS_PER_HOUR)
  const timeText = minTimestamp === 0 ? `All time` : `${hours}hr`

  return (
    <div
      className={classNames(
        'w-full max-w-md flex flex-col gap-4 items-center p-5 bg-pt-purple-100/50 rounded-lg',
        className
      )}
    >
      <span className='text-center'>{timeText} burn</span>
      <BurnCardItem name='Prizes to LPs' amount={0n - burnAmounts.lp} token={prizeToken} />
      <BurnCardItem name='Manual Burns' amount={0n - burnAmounts.manual} token={prizeToken} />
      <BurnCardItem name='Other' amount={0n - burnAmounts.other} token={prizeToken} />
      <hr className='w-full border-gray-400' />
      <BurnCardItem
        name={`${timeText} changes`}
        amount={0n - (burnAmounts.lp + burnAmounts.manual + burnAmounts.other)}
        token={prizeToken}
        alwaysShow={true}
        nameClassName='capitalize'
      />
    </div>
  )
}

interface BurnCardItemProps {
  name: string
  amount: bigint
  token: Token
  alwaysShow?: boolean
  className?: string
  nameClassName?: string
  amountClassName?: string
}

const BurnCardItem = (props: BurnCardItemProps) => {
  const { name, amount, token, alwaysShow, className, nameClassName, amountClassName } = props

  const formattedAmount = formatBigIntForDisplay(amount, token.decimals, {
    maximumFractionDigits: 0
  })

  if (!!amount || alwaysShow) {
    return (
      <div className={classNames('w-full flex justify-between whitespace-nowrap', className)}>
        <span className={classNames('md:text-2xl', nameClassName)}>{name}</span>
        <span
          className={classNames(
            'flex gap-1 items-center',
            {
              'text-green-600': amount > 0n,
              'text-red-600': amount < 0n
            },
            amountClassName
          )}
        >
          <span className='text-2xl'>
            {amount > 0n && '+'}
            {formattedAmount}
          </span>
          <span className='text-sm md:text-base'>{token.symbol}</span>
        </span>
      </div>
    )
  }

  return <></>
}
