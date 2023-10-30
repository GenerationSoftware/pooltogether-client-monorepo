import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { PrizePoolBadge } from '@shared/react-components'
import { Win } from '@shared/types'
import { Table, TableProps } from '@shared/ui'
import { getSimpleDate } from '@shared/utilities'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useState } from 'react'
import { AccountWinAmount } from './AccountWinAmount'
import { AccountWinButtons } from './AccountWinButtons'

interface AccountWinningsTableProps extends Omit<TableProps, 'data' | 'keyPrefix'> {
  wins: Win[]
  prizePools: PrizePool[]
}

export const AccountWinningsTable = (props: AccountWinningsTableProps) => {
  const { wins, prizePools, className, rounded, ...rest } = props

  const t_common = useTranslations('Common')
  const t_account = useTranslations('Account')

  const baseNumWins = 10
  const [numWins, setNumWins] = useState<number>(baseNumWins)

  const tableData: TableProps['data'] = {
    headers: {
      date: { content: t_account('winHeaders.date') },
      prizePool: { content: t_account('winHeaders.prizePool'), position: 'center' },
      winnings: { content: t_account('winHeaders.winnings'), position: 'center' },
      info: { content: t_account('winHeaders.moreInfo'), position: 'center' }
    },
    rows: wins
      .slice(0, numWins)
      .map((win) => {
        const winId = `${win.chainId}-${win.txHash}`
        const prizePool = prizePools.find((prizePool) => prizePool.chainId === win.chainId)

        if (!!prizePool) {
          const cells: TableProps['data']['rows'][0]['cells'] = {
            date: { content: getSimpleDate(win.timestamp) },
            prizePool: {
              content: (
                <Link href={`/prizes?network=${win.chainId}`}>
                  <PrizePoolBadge chainId={win.chainId} onClick={() => {}} intl={t_common} />
                </Link>
              ),
              position: 'center'
            },
            winnings: {
              content: (
                <AccountWinAmount
                  prizePool={
                    prizePools.find((prizePool) => prizePool.chainId === win.chainId) as PrizePool
                  }
                  amount={win.payout}
                  amountClassName='text-sm'
                />
              ),
              position: 'center'
            },
            info: { content: <AccountWinButtons win={win} />, position: 'center' }
          }
          return { id: winId, cells }
        } else {
          return { id: winId, cells: {} }
        }
      })
      .filter((row) => Object.keys(row.cells).length > 0)
  }

  return (
    <div
      className={classNames(
        'w-full flex flex-col bg-pt-bg-purple-dark',
        { 'rounded-lg': rounded },
        className
      )}
    >
      <Table
        data={tableData}
        keyPrefix='accountWinningsTable'
        className='w-full bg-transparent'
        rounded={rounded}
        {...rest}
      />
      {wins.length > numWins && (
        <span
          className='w-full flex pb-4 justify-center text-pt-purple-300 cursor-pointer'
          onClick={() => setNumWins(numWins + baseNumWins)}
        >
          {t_common('showMore')}
        </span>
      )}
    </div>
  )
}
