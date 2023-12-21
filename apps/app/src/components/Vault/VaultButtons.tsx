import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { useUserVaultShareBalance } from '@generationsoftware/hyperstructure-react-hooks'
import { WithdrawButton } from '@shared/react-components'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { DepositButtonWithDeprecated } from '../DepositButtonWithDeprecated'

interface VaultButtonsProps {
  vault: Vault
  fullSized?: boolean
  inverseOrder?: boolean
  className?: string
}

export const VaultButtons = (props: VaultButtonsProps) => {
  const { vault, fullSized, inverseOrder, className } = props

  const t = useTranslations('Common')

  const { address: userAddress } = useAccount()

  const { data: vaultBalance } = useUserVaultShareBalance(vault, userAddress as Address)

  const shareBalance = vaultBalance?.amount ?? 0n

  const vaultDeprecated = vault.tags?.includes('deprecated')

  return (
    <div className={classNames('flex items-center gap-2', className)}>
      <DepositButtonWithDeprecated
        vault={vault}
        fullSized={fullSized}
        inverseOrder={true}
        vaultDeprecated={vaultDeprecated}
      />
      {shareBalance > 0n && (
        <WithdrawButton
          vault={vault}
          fullSized={true}
          className={inverseOrder ? 'order-1' : 'order-2'}
          color='transparent'
        >
          {t('withdraw')}
        </WithdrawButton>
      )}
    </div>
  )
}
