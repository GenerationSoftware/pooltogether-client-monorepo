import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { DelegateButton, DepositButton, WithdrawButton } from '@shared/react-components'
import classNames from 'classnames'
import * as fathom from 'fathom-client'
import { useTranslations } from 'next-intl'
import { FATHOM_EVENTS } from '@constants/config'

interface VaultPageButtonsProps {
  vault: Vault
  className?: string
}

export const VaultPageButtons = (props: VaultPageButtonsProps) => {
  const { vault, className } = props

  const t_common = useTranslations('Common')
  const t_tooltips = useTranslations('Tooltips')

  return (
    <div className={classNames('flex items-center gap-2 md:gap-4', className)}>
      <DepositButton
        vault={vault}
        extraOnClick={() => fathom.trackEvent(FATHOM_EVENTS.openedDepositModal)}
        intl={{ base: t_common, tooltips: t_tooltips }}
      />
      <WithdrawButton
        vault={vault}
        extraOnClick={() => fathom.trackEvent(FATHOM_EVENTS.openedWithdrawModal)}
        color='transparent'
      >
        {t_common('withdraw')}
      </WithdrawButton>
      <DelegateButton
        vault={vault}
        extraOnClick={() => fathom.trackEvent(FATHOM_EVENTS.openedDelegateModal)}
        color='transparent'
      >
        {t_common('delegate')}
      </DelegateButton>
    </div>
  )
}
