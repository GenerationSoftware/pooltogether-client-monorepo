import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { useUserVaultShareBalance } from '@generationsoftware/hyperstructure-react-hooks'
import { DepositButton, WithdrawButton } from '@shared/react-components'
import { Tooltip } from '@shared/ui'
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

  const t = useTranslations('Common')

  const { address: userAddress } = useAccount()

  const { data: vaultBalance } = useUserVaultShareBalance(vault, userAddress as Address)

  const shareBalance = vaultBalance?.amount ?? 0n

  return (
    <div className={classNames('flex items-center gap-2', className)}>
      <Tooltip
        content={
          <div className={classNames('max-w-[32ch] flex flex-col gap-2 text-start', className)}>
            <strong>Deposits disabled</strong>
            <span>This is an old vault, please use the new {vault.tokenData?.symbol} vault</span>
          </div>
        }
      >
        <DepositButton
          vault={vault}
          fullSized={fullSized}
          className={inverseOrder ? 'order-2' : 'order-1'}
          disabled
        >
          {t('deposit')}
        </DepositButton>
      </Tooltip>
      {shareBalance > 0n && (
        <WithdrawButton
          vault={vault}
          fullSized={fullSized}
          className={inverseOrder ? 'order-1' : 'order-2'}
          color='transparent'
        >
          {t('withdraw')}
        </WithdrawButton>
      )}
    </div>
  )
}
