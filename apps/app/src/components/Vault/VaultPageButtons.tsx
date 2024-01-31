import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { GiftIcon } from '@heroicons/react/24/solid'
import { DelegateButton, DepositButton, WithdrawButton } from '@shared/react-components'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'

interface VaultPageButtonsProps {
  vault: Vault
  className?: string
}

export const VaultPageButtons = (props: VaultPageButtonsProps) => {
  const { vault, className } = props

  const t = useTranslations('Common')

  return (
    <div className={classNames('flex gap-4 items-center', className)}>
      <WithdrawButton vault={vault} color='transparent'>
        {t('withdraw')}
      </WithdrawButton>
      <DepositButton vault={vault}>{t('deposit')}</DepositButton>
      <DelegateButton vault={vault} color='transparent'>
        <>
          <GiftIcon className='w-4 h-4 my-0.5 sm:my-0' />{' '}
          <span className='hidden sm:inline-block pl-2'>{t('delegate') ?? `Delegate`}</span>
        </>
      </DelegateButton>
    </div>
  )
}
