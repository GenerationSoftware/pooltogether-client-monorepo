import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { useUserVaultShareBalance } from '@generationsoftware/hyperstructure-react-hooks'
import { DepositButton, DeprecatedVaultTooltip, WithdrawButton } from '@shared/react-components'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import { Address } from 'viem'
import { useAccount } from 'wagmi'

interface VaultButtonsProps {
  vault: Vault
  fullSized?: boolean
  inverseOrder?: boolean
  className?: string
}

export const VaultButtons = (props: VaultButtonsProps) => {
  const { vault, fullSized, inverseOrder, className } = props

  const t_common = useTranslations('Common')
  const t_tooltips = useTranslations('Tooltips')

  const { address: userAddress } = useAccount()

  const { data: vaultBalance } = useUserVaultShareBalance(vault, userAddress as Address)

  const shareBalance = vaultBalance?.amount ?? 0n

  const isDeprecated = vault.tags?.includes('deprecated')

  return (
    <div className={classNames('flex items-center gap-2', className)}>
      {isDeprecated ? (
        <div className={classNames('w-full', inverseOrder ? 'order-2' : 'order-1')}>
          <DeprecatedVaultTooltip intl={t_tooltips('deprecatedVault')}>
            <DepositButton vault={vault} fullSized={fullSized}>
              {t_common('deposit')}
            </DepositButton>
          </DeprecatedVaultTooltip>
        </div>
      ) : (
        <DepositButton
          vault={vault}
          fullSized={fullSized}
          className={inverseOrder ? 'order-2' : 'order-1'}
        >
          {t_common('deposit')}
        </DepositButton>
      )}
      {shareBalance > 0n && (
        <WithdrawButton
          vault={vault}
          fullSized={fullSized}
          className={inverseOrder ? 'order-1' : 'order-2'}
          color='transparent'
        >
          {t_common('withdraw')}
        </WithdrawButton>
      )}
    </div>
  )
}
