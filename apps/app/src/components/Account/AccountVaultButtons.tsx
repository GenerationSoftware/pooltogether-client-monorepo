import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { useUserVaultShareBalance } from '@generationsoftware/hyperstructure-react-hooks'
import { WithdrawButton } from '@shared/react-components'
import { useTranslations } from 'next-intl'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { DepositButtonWithDeprecated } from '../DepositButtonWithDeprecated'

interface AccountVaultButtonsProps {
  vault: Vault
}

export const AccountVaultButtons = (props: AccountVaultButtonsProps) => {
  const { vault } = props

  const t = useTranslations('Common')

  const { address: userAddress } = useAccount()

  const { data: vaultBalance } = useUserVaultShareBalance(vault, userAddress as Address)

  const shareBalance = vaultBalance?.amount ?? 0n

  const vaultDeprecated = vault.tags?.includes('deprecated')

  return (
    <div className='flex justify-end gap-2'>
      <WithdrawButton vault={vault} color='transparent'>
        {t('withdraw')}
      </WithdrawButton>

      <DepositButtonWithDeprecated
        vault={vault}
        fullSized={true}
        inverseOrder={true}
        vaultDeprecated={vaultDeprecated}
      />
    </div>
  )
}
