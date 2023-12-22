import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { DepositButton } from '@shared/react-components'
import { Tooltip } from '@shared/ui'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import { OLD_VAULT_NEW_VAULT_MAPPING } from '@constants/config'

interface DepositButtonsProps {
  vault: Vault
  fullSized?: boolean
  inverseOrder?: boolean
  className?: string
  vaultDeprecated?: boolean
}

export const DepositButtonWithDeprecated = (props: DepositButtonsProps) => {
  const { vault, fullSized, inverseOrder, className, vaultDeprecated } = props

  const t = useTranslations('Common')

  const depositButton = (
    <DepositButton
      vault={vault}
      fullSized={fullSized}
      className={inverseOrder ? 'order-2' : 'order-1'}
      disabled={vaultDeprecated}
    >
      {t('deposit')}
    </DepositButton>
  )

  return vaultDeprecated ? (
    <Tooltip
      fullSized={fullSized}
      inverseOrder={inverseOrder}
      content={
        <div className={classNames('max-w-[32ch] flex flex-col gap-2 text-start', className)}>
          <strong>Deposits disabled</strong>
          <span>
            This vault has been deprecated. Please migrate to the new{' '}
            {vault.tokenData?.symbol && OLD_VAULT_NEW_VAULT_MAPPING[vault.tokenData?.symbol]} vault.
          </span>
        </div>
      }
    >
      {depositButton}
    </Tooltip>
  ) : (
    depositButton
  )
}
