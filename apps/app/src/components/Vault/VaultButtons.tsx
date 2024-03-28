import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { useUserVaultShareBalance } from '@generationsoftware/hyperstructure-react-hooks'
import { GiftIcon } from '@heroicons/react/24/solid'
import { DelegateButton, DepositButton, WithdrawButton } from '@shared/react-components'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import { Address } from 'viem'
import { useAccount } from 'wagmi'

interface VaultButtonsProps {
  vault: Vault
  forceShow?: ('delegate' | 'withdraw')[]
  forceHide?: ('delegate' | 'withdraw')[]
  fullSized?: boolean
  className?: string
}

export const VaultButtons = (props: VaultButtonsProps) => {
  const { vault, forceShow, forceHide, fullSized, className } = props

  const t_common = useTranslations('Common')
  const t_tooltips = useTranslations('Tooltips')

  const { address: userAddress } = useAccount()

  const { data: vaultBalance } = useUserVaultShareBalance(vault, userAddress as Address)
  const shareBalance = vaultBalance?.amount ?? 0n

  const isDelegateButtonShown =
    (shareBalance > 0n || forceShow?.includes('delegate')) && !forceHide?.includes('delegate')
  const isWithdrawButtonShown =
    (shareBalance > 0n || forceShow?.includes('withdraw')) && !forceHide?.includes('withdraw')

  return (
    <div className={classNames('flex items-center gap-2', className)}>
      {isDelegateButtonShown && (
        <DelegateButton vault={vault} color='transparent' className='w-full'>
          <GiftIcon className='w-4 h-4 my-0.5' />
        </DelegateButton>
      )}
      {isWithdrawButtonShown && (
        <WithdrawButton vault={vault} fullSized={fullSized} color='transparent'>
          {t_common('withdraw')}
        </WithdrawButton>
      )}
      <DepositButton
        vault={vault}
        fullSized={fullSized}
        intl={{ base: t_common, tooltips: t_tooltips }}
      />
    </div>
  )
}
