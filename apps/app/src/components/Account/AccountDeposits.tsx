import {
  useAllUserVaultBalances,
  useSelectedVaults
} from '@generationsoftware/hyperstructure-react-hooks'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { Button } from '@shared/ui'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useMemo } from 'react'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { PrizePoolCards } from '@components/Prizes/PrizePoolCards'
import { AccountDepositsCards } from './AccountDepositsCards'
import { AccountDepositsHeader } from './AccountDepositsHeader'
import { AccountDepositsTable } from './AccountDepositsTable'

interface AccountDepositsProps {
  address?: Address
  className?: string
}

export const AccountDeposits = (props: AccountDepositsProps) => {
  const { address, className } = props

  const { address: _userAddress } = useAccount()
  const userAddress = address ?? _userAddress

  const { vaults } = useSelectedVaults()

  const { data: vaultBalances } = useAllUserVaultBalances(vaults, userAddress as Address)

  const isEmpty = useMemo(() => {
    return !!vaultBalances && Object.values(vaultBalances).every((token) => token.amount === 0n)
  }, [vaultBalances])

  const isExternalUser = useMemo(() => {
    return !!address && address.toLowerCase() !== _userAddress?.toLowerCase()
  }, [address, _userAddress])

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
      {isEmpty && !isExternalUser && <NoDepositsCard />}
      {!isEmpty && (
        <AccountDepositsTable
          address={userAddress}
          rounded={true}
          className='hidden mt-4 lg:block'
        />
      )}
      {!isEmpty && <AccountDepositsCards address={userAddress} className='lg:hidden' />}
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
        <span className='text-pt-purple-100'>{t('noPrizeTokens')}</span>
        <Link href='/vaults' className='text-pt-teal'>
          {t('depositNow')}
        </Link>
      </div>
    </div>
  )
}
