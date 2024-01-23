import { PrizePool, Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  usePrizeOdds,
  useUserVaultDelegate,
  useUserVaultShareBalance
} from '@generationsoftware/hyperstructure-react-hooks'
import { Spinner } from '@shared/ui'
import { formatNumberForDisplay, NETWORK, shorten } from '@shared/utilities'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Address } from 'viem'
import { useAccount, useEnsName } from 'wagmi'
import { useSupportedPrizePools } from '@hooks/useSupportedPrizePools'

interface AccountVaultOddsProps {
  vault: Vault
  address?: Address
  className?: string
  spinnerClassName?: string
  delegatedClassName?: string
}

export const AccountVaultOdds = (props: AccountVaultOddsProps) => {
  const { vault, address, className, spinnerClassName, delegatedClassName } = props

  const t = useTranslations('Account')

  const { address: _userAddress } = useAccount()
  const userAddress = address ?? _userAddress

  const numDraws = 7
  const { data: shareBalance, isFetched: isFetchedShareBalance } = useUserVaultShareBalance(
    vault,
    userAddress as Address,
    numDraws,
    { refetchOnWindowFocus: true }
  )

  const { data: delegate, isFetched: isFetchedDelegate } = useUserVaultDelegate(
    vault,
    userAddress as Address,
    { refetchOnWindowFocus: true }
  )

  const { data: ensName } = useEnsName({ chainId: NETWORK.mainnet, address: delegate })

  const prizePools = useSupportedPrizePools()
  const prizePool = Object.values(prizePools).find(
    (prizePool) => prizePool.chainId === vault.chainId
  )

  const { data: prizeOdds, isFetched: isFetchedPrizeOdds } = usePrizeOdds(
    prizePool as PrizePool,
    vault,
    shareBalance?.amount ?? 0n
  )

  if (!userAddress || shareBalance?.amount === 0n) {
    return <span className={className}>-</span>
  }

  if (!isFetchedShareBalance || !isFetchedDelegate || !isFetchedPrizeOdds) {
    return <Spinner className={classNames(className, spinnerClassName)} />
  }

  if (!!delegate && delegate?.toLowerCase() !== userAddress.toLowerCase()) {
    return (
      <span className={classNames(className, delegatedClassName)}>
        {t.rich('delegatedTo', {
          account: ensName ?? shorten(delegate),
          link: (chunks) => (
            <Link
              href={`/account/${ensName ?? delegate}`}
              className='text-pt-teal hover:text-pt-teal-dark'
            >
              {chunks}
            </Link>
          )
        })}
      </span>
    )
  }

  if (prizeOdds === undefined) {
    return <span className={className}>?</span>
  }

  return (
    <span className={className}>
      {t('oneInXChance', {
        number: formatNumberForDisplay(prizeOdds.oneInX, { maximumSignificantDigits: 3 })
      })}
    </span>
  )
}
