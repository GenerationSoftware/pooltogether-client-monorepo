import { Vault } from '@pooltogether/hyperstructure-client-js'
import { DepositButton, WithdrawButton } from '@shared/react-components'
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
    </div>
  )
}
