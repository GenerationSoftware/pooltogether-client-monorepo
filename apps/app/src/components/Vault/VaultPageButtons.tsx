import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { DelegateButton, DepositButton, WithdrawButton } from '@shared/react-components'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import { useAccount } from 'wagmi'

interface VaultPageButtonsProps {
  vault: Vault
  className?: string
}

export const VaultPageButtons = (props: VaultPageButtonsProps) => {
  const { vault, className } = props

  const t_common = useTranslations('Common')
  const t_tooltips = useTranslations('Tooltips')

  const { address: userAddress } = useAccount()

  return (
    <div className={classNames('flex items-center gap-2 md:gap-4', className)}>
      <DepositButton vault={vault} intl={{ base: t_common, tooltips: t_tooltips }} />
      <WithdrawButton vault={vault} color='transparent'>
        {t_common('withdraw')}
      </WithdrawButton>
      {!!userAddress && (
        <DelegateButton vault={vault} color='transparent'>
          {t_common('delegate')}
        </DelegateButton>
      )}
    </div>
  )
}
