import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { usePublicClientsByChain } from '@generationsoftware/hyperstructure-react-hooks'
import { VaultBadge } from '@shared/react-components'
import { Table, TableProps } from '@shared/ui'
import { lower } from '@shared/utilities'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { useUserClaimablePoolWidePromotions } from '@hooks/useUserClaimablePoolWidePromotions'
import { useUserClaimablePromotions } from '@hooks/useUserClaimablePromotions'
import { useUserClaimedPoolWidePromotions } from '@hooks/useUserClaimedPoolWidePromotions'
import { useUserClaimedPromotions } from '@hooks/useUserClaimedPromotions'
import { AccountPromotionClaimableRewards } from './AccountPromotionClaimableRewards'
import { AccountPromotionClaimActions } from './AccountPromotionClaimActions'
import { AccountPromotionClaimedRewards } from './AccountPromotionClaimedRewards'
import { AccountPromotionToken } from './AccountPromotionToken'

interface AccountPromotionsTableProps extends Omit<TableProps, 'data' | 'keyPrefix'> {
  userAddress?: Address
}

export const AccountPromotionsTable = (props: AccountPromotionsTableProps) => {
  const { userAddress, className, innerClassName, headerClassName, rowClassName, ...rest } = props

  const t_common = useTranslations('Common')
  const t_headers = useTranslations('Account.bonusRewardHeaders')

  const baseNumTableRows = 10
  const [numTableRows, setNumTableRows] = useState<number>(baseNumTableRows)

  const publicClients = usePublicClientsByChain()

  const { address: _userAddress } = useAccount()

  const isExternalUser = useMemo(() => {
    return !!userAddress && userAddress.toLowerCase() !== _userAddress?.toLowerCase()
  }, [userAddress, _userAddress])

  const { data: claimed } = useUserClaimedPromotions((userAddress ?? _userAddress)!)
  const { data: claimable } = useUserClaimablePromotions((userAddress ?? _userAddress)!)

  const { data: poolWideClaimed } = useUserClaimedPoolWidePromotions((userAddress ?? _userAddress)!)
  const { data: poolWideClaimable } = useUserClaimablePoolWidePromotions(
    (userAddress ?? _userAddress)!
  )

  const tableHeaders = useMemo(() => {
    const headers: TableProps['data']['headers'] = {
      token: { content: t_headers('prizeVault') },
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
    const promotions: { [id: string]: { startTimestamp: number; claimable: boolean } } = {}

    claimed.forEach((promotion) => {
      const id = `${promotion.chainId}-${promotion.promotionId}-${lower(promotion.vault)}-0`

      if (promotions[id] === undefined) {
        promotions[id] = { startTimestamp: Number(promotion.startTimestamp), claimable: false }
      }
    })

    claimable.forEach((promotion) => {
      const id = `${promotion.chainId}-${promotion.promotionId}-${lower(promotion.vault)}-0`

      if (promotions[id] === undefined) {
        promotions[id] = { startTimestamp: Number(promotion.startTimestamp), claimable: true }
      } else if (!promotions[id].claimable) {
        promotions[id].claimable = true
      }
    })

    poolWideClaimed.forEach((promotion) => {
      const id = `${promotion.chainId}-${promotion.promotionId}-${lower(promotion.vault)}-1`

      if (promotions[id] === undefined) {
        promotions[id] = { startTimestamp: Number(promotion.startTimestamp), claimable: false }
      }
    })

    poolWideClaimable.forEach((promotion) => {
      const id = `${promotion.chainId}-${promotion.promotionId}-${lower(promotion.vault)}-1`

      if (promotions[id] === undefined) {
        promotions[id] = { startTimestamp: Number(promotion.startTimestamp), claimable: true }
      } else if (!promotions[id].claimable) {
        promotions[id].claimable = true
      }
    })

    const sortedPromotions = Object.entries(promotions)
      .sort((a, b) => b[1].startTimestamp - a[1].startTimestamp)
      .sort((a, b) => +b[1].claimable - +a[1].claimable)
      ?.map(([id]) => id)

    sortedPromotions.forEach((uniquePromotionId) => {
      const chainId = parseInt(uniquePromotionId.split('-')[0])
      const promotionId = BigInt(uniquePromotionId.split('-')[1])
      const vaultAddress = uniquePromotionId.split('-')[2]
      const isPoolWide = uniquePromotionId.split('-')[3] === '1'

      const promotionInfo = isPoolWide
        ? poolWideClaimed.find(
            (p) =>
              p.chainId === chainId &&
              p.promotionId === promotionId &&
              lower(p.vault) === vaultAddress
          ) ??
          poolWideClaimable.find(
            (p) =>
              p.chainId === chainId &&
              p.promotionId === promotionId &&
              lower(p.vault) === vaultAddress
          )
        : claimed.find((p) => p.chainId === chainId && p.promotionId === promotionId) ??
          claimable.find((p) => p.chainId === chainId && p.promotionId === promotionId)

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
                userAddress={userAddress ?? _userAddress}
                vaultAddress={promotionInfo.vault}
                isPoolWide={isPoolWide}
              />
            ),
            position: 'center'
          },
          claimable: {
            content: (
              <AccountPromotionClaimableRewards
                chainId={chainId}
                promotionId={promotionId}
                userAddress={userAddress ?? _userAddress}
                vaultAddress={promotionInfo.vault}
                isPoolWide={isPoolWide}
              />
            ),
            position: 'center'
          },
          claims: {
            content: (
              <AccountPromotionClaimActions
                chainId={chainId}
                promotionId={promotionId}
                userAddress={userAddress ?? _userAddress}
                vaultAddress={promotionInfo.vault}
                isPoolWide={isPoolWide}
              />
            ),
            position: 'right'
          }
        }

        rows.push({ id: uniquePromotionId, cells })
      }
    })

    return rows
  }, [claimed, claimable, poolWideClaimed, poolWideClaimable])

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
