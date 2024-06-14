import { CurrencyValue } from '@shared/react-components'
import { Spinner } from '@shared/ui'
import { lower, NETWORK, shorten } from '@shared/utilities'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import { Address } from 'viem'
import { useAccount, useEnsName } from 'wagmi'
import { WALLET_NAMES } from '@constants/config'
import { useUserTotalWinnings } from '@hooks/useUserTotalWinnings'

interface AccountWinningsHeaderProps {
  address?: Address
  className?: string
}

export const AccountWinningsHeader = (props: AccountWinningsHeaderProps) => {
  const { address, className } = props

  const t = useTranslations('Account')

  const { address: _userAddress } = useAccount()
  const userAddress = address ?? _userAddress

  const isExternalUser = !!address && address.toLowerCase() !== _userAddress?.toLowerCase()

  const { data: totalWinnings } = useUserTotalWinnings(userAddress!, {
    skipPrizeChecking: isExternalUser
  })

  const { data: ensName } = useEnsName({ chainId: NETWORK.mainnet, address: userAddress })

  return (
    <div className={classNames('flex flex-col items-center gap-1 md:gap-2', className)}>
      <span className='text-sm text-pt-purple-100 md:text-base'>
        {isExternalUser
          ? t('externalAccountWinnings', {
              account: WALLET_NAMES[lower(address)]?.name ?? ensName ?? shorten(address)
            })
          : t('yourWinnings')}
      </span>
      <span className='text-[1.75rem] font-grotesk font-medium md:text-4xl'>
        {!!userAddress && totalWinnings !== undefined ? (
          <CurrencyValue baseValue={totalWinnings} countUp={true} fallback={<Spinner />} />
        ) : (
          <Spinner />
        )}
      </span>
    </div>
  )
}
