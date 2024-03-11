import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { usePublicClientsByChain } from '@generationsoftware/hyperstructure-react-hooks'
import { VaultBadge } from '@shared/react-components'
import { Table, TableProps } from '@shared/ui'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { useUserClaimablePromotions } from '@hooks/useUserClaimablePromotions'
import { useUserClaimedPromotions } from '@hooks/useUserClaimedPromotions'
import { AccountPromotionClaimableRewards } from './AccountPromotionClaimableRewards'
import { AccountPromotionClaimActions } from './AccountPromotionClaimActions'
import { AccountPromotionClaimedRewards } from './AccountPromotionClaimedRewards'
import { AccountPromotionToken } from './AccountPromotionToken'

interface AccountPromotionsTableProps extends Omit<TableProps, 'data' | 'keyPrefix'> {
  address?: Address
}

export const AccountPromotionsTable = (props: AccountPromotionsTableProps) => {
  const { address, className, innerClassName, headerClassName, rowClassName, ...rest } = props

  const t_common = useTranslations('Common')
  const t_headers = useTranslations('Account.bonusRewardHeaders')

  const baseNumTableRows = 10
  const [numTableRows, setNumTableRows] = useState<number>(baseNumTableRows)

  const publicClients = usePublicClientsByChain()

  const { address: _userAddress } = useAccount()
  const userAddress = address ?? _userAddress

  const isExternalUser = useMemo(() => {
    return !!address && address.toLowerCase() !== _userAddress?.toLowerCase()
  }, [address, _userAddress])

  const { data: claimed } = useUserClaimedPromotions(userAddress as Address)
  const { data: claimable } = useUserClaimablePromotions(userAddress as Address)

  const tableHeaders = useMemo(() => {
    const headers: TableProps['data']['headers'] = {
      token: { content: t_headers('token') },
      rewardToken: {
        content: t_headers('rewardToken'),
        position: 'center'
      },
      claimed: {
        content: t_headers('rewardsClaimed'),
        position: 'center'
      },
      claimable: {
        content: t_headers('rewardsClaimable'),
        position: 'center'
      }
    }

    if (!isExternalUser) {
      headers.claims = { content: <ClaimsHeader />, position: 'right' }
    }

    return headers
  }, [isExternalUser])

  const tableRows = useMemo(() => {
    const rows: TableProps['data']['rows'] = []
    const uniquePromotions = new Set<string>()

    claimed.forEach((promotion) =>
      uniquePromotions.add(`${promotion.chainId}-${promotion.promotionId}`)
    )
    claimable.forEach((promotion) =>
      uniquePromotions.add(`${promotion.chainId}-${promotion.promotionId}`)
    )

    uniquePromotions.forEach((uniquePromotionId) => {
      const chainId = parseInt(uniquePromotionId.split('-')[0])
      const promotionId = BigInt(uniquePromotionId.split('-')[1])
      const promotionInfo =
        claimed.find(
          (promotion) => promotion.chainId === chainId && promotion.promotionId === promotionId
        ) ??
        claimable.find(
          (promotion) => promotion.chainId === chainId && promotion.promotionId === promotionId
        )

      if (!!promotionInfo) {
        const vault = new Vault(chainId, promotionInfo.vault, publicClients[chainId])

        const cells: TableProps['data']['rows'][0]['cells'] = {
          token: {
            content: (
              <>
                <Link href={`/vault/${vault.chainId}/${vault.address}`}>
                  <VaultBadge vault={vault} onClick={() => {}} />
                </Link>
              </>
            ),
            className: 'gap-2'
          },
          rewardToken: {
            content: <AccountPromotionToken chainId={chainId} tokenAddress={promotionInfo.token} />,
            position: 'center'
          },
          claimed: {
            content: (
              <AccountPromotionClaimedRewards
                chainId={chainId}
                promotionId={promotionId}
                address={userAddress}
              />
            ),
            position: 'center'
          },
          claimable: {
            content: (
              <AccountPromotionClaimableRewards
                chainId={chainId}
                promotionId={promotionId}
                address={userAddress}
              />
            ),
            position: 'center'
          },
          claims: {
            content: (
              <AccountPromotionClaimActions
                chainId={chainId}
                promotionId={promotionId}
                address={userAddress}
              />
            ),
            position: 'right'
          }
        }

        rows.push({ id: uniquePromotionId, cells })
      }
    })

    return rows
  }, [claimed, claimable])

  return (
    <div
      className={classNames(
        'w-full flex flex-col bg-pt-bg-purple-dark rounded-t-2xl rounded-b-[2.5rem]',
        className
      )}
    >
      <Table
        data={{ headers: tableHeaders, rows: tableRows.slice(0, numTableRows) }}
        keyPrefix='accountPromotionsTable'
        className='w-full bg-transparent'
        innerClassName={classNames('!gap-3', innerClassName)}
        headerClassName={classNames('px-4', headerClassName)}
        rowClassName={classNames('!px-4 py-4 rounded-3xl', rowClassName)}
        {...rest}
      />
      {tableRows.length > numTableRows && (
        <span
          className='w-full flex pb-4 justify-center text-pt-purple-300 cursor-pointer'
          onClick={() => setNumTableRows(numTableRows + baseNumTableRows)}
        >
          {t_common('showMore')}
        </span>
      )}
    </div>
  )
}

const ClaimsHeader = () => {
  const t = useTranslations('Account.bonusRewardHeaders')

  return <span className='w-24 text-center'>{t('claims')}</span>
}
