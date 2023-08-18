import { ArrowRightIcon } from '@heroicons/react/24/outline'
import {
  useAllUserVaultBalances,
  useSelectedVaults
} from '@pooltogether/hyperstructure-react-hooks'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { Button } from '@shared/ui'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { PrizePoolCards } from '@components/Prizes/PrizePoolCards'
import { AccountDepositsHeader } from './AccountDepositsHeader'
import { AccountDepositsOdds } from './AccountDepositsOdds'
import { AccountDepositsTable } from './AccountDepositsTable'
import { AccountVaultCards } from './AccountVaultCards'

interface AccountDepositsProps {
  address?: Address
  className?: string
}

export const AccountDeposits = (props: AccountDepositsProps) => {
  const { address, className } = props

  const { address: _userAddress } = useAccount()
  const userAddress = address ?? _userAddress

  const { vaults } = useSelectedVaults()

  const { data: vaultBalances, isFetched: isFetchedVaultBalances } = useAllUserVaultBalances(
    vaults,
    userAddress as Address
  )

  const isEmpty =
    isFetchedVaultBalances && !!vaultBalances
      ? Object.keys(vaultBalances).every((vaultId) => vaultBalances[vaultId].amount === 0n)
      : false

  if (typeof window !== 'undefined' && userAddress === undefined) {
    return (
      <div className='flex flex-col h-[80vh] w-full items-center justify-evenly'>
        <NoWalletCard />
        <PrizePoolCards />
      </div>
    )
  }

  return (
    <div
      className={classNames(
        'w-full max-w-xl flex flex-col gap-2 items-center md:gap-4 lg:max-w-none',
        className
      )}
    >
      <AccountDepositsHeader address={userAddress} />
      {isEmpty && <NoDepositsCard />}
      {!isEmpty && (
        <AccountDepositsTable
          address={userAddress}
          rounded={true}
          className='hidden mt-4 lg:block'
        />
      )}
      {!isEmpty && <AccountVaultCards address={userAddress} className='lg:hidden' />}
      {!isEmpty && <AccountDepositsOdds address={userAddress} />}
    </div>
  )
}

interface NoWalletCardProps {
  className?: string
}

const NoWalletCard = (props: NoWalletCardProps) => {
  const { className } = props

  const t_common = useTranslations('Common')
  const t_account = useTranslations('Account')

  const { openConnectModal } = useConnectModal()

  return (
    <div className={classNames('flex flex-col max-w-md gap-6 items-center', className)}>
      <span className='text-center text-3xl font-grotesk font-medium md:text-5xl'>
        {t_account('connectWallet')}
      </span>
      <Button onClick={openConnectModal}>
        <div className='inline-flex gap-3 font-medium'>
          <span>{t_common('connectWallet')}</span>
          <ArrowRightIcon className='h-5 w-5' />
        </div>
      </Button>
    </div>
  )
}

interface NoDepositsCardProps {
  className?: string
}

const NoDepositsCard = (props: NoDepositsCardProps) => {
  const { className } = props

  const t = useTranslations('Account')

  return (
    <div className={classNames('w-full rounded-lg lg:p-4 lg:bg-pt-bg-purple', className)}>
      <div className='flex flex-col w-full gap-2 items-center justify-center p-3 text-sm bg-pt-transparent rounded-lg lg:flex-row lg:gap-3 lg:text-lg lg:font-medium'>
        <span className='text-pt-purple-100'>{t('noPrizeAssets')}</span>
        <Link href='/vaults' className='text-pt-teal'>
          {t('depositNow')}
        </Link>
      </div>
    </div>
  )
}
