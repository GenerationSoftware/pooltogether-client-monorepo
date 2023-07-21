import { useUserTotalBalance } from '@pooltogether/hyperstructure-react-hooks'
import { CurrencyValue } from '@shared/react-components'
import { Spinner } from '@shared/ui'
import { NETWORK, shorten } from '@shared/utilities'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { Address } from 'viem'
import { useAccount, useEnsName } from 'wagmi'

interface AccountDepositsHeaderProps {
  address?: Address
  className?: string
}

export const AccountDepositsHeader = (props: AccountDepositsHeaderProps) => {
  const { address, className } = props

  const t = useTranslations('Account')

  const { address: _userAddress } = useAccount()
  const userAddress = address ?? _userAddress

  const { data: totalBalance, isFetched: isFetchedTotalBalance } = useUserTotalBalance(
    userAddress as Address
  )

  const { data: ensName } = useEnsName({ chainId: NETWORK.mainnet, address: userAddress })

  const externalAccountName = useMemo(() => {
    const isExternalUser = !!address && address.toLowerCase() !== _userAddress?.toLowerCase()
    if (isExternalUser) {
      return ensName ?? shorten(address)
    }
  }, [address, _userAddress, ensName])

  return (
    <div className={classNames('flex flex-col items-center gap-1 md:gap-2', className)}>
      <span className='text-sm text-pt-purple-100 md:text-base'>
        {!!externalAccountName
          ? t('externalAccountDeposits', { account: externalAccountName })
          : t('yourDeposits')}
      </span>
      <span className='text-2xl font-averta font-semibold md:text-3xl'>
        {isFetchedTotalBalance && !!userAddress && totalBalance !== undefined ? (
          <CurrencyValue baseValue={totalBalance} countUp={true} fallback={<Spinner />} />
        ) : (
          <Spinner />
        )}
      </span>
    </div>
  )
}
