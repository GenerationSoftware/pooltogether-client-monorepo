import { Vault } from '@pooltogether/hyperstructure-client-js'
import { useUserVaultShareBalance } from '@pooltogether/hyperstructure-react-hooks'
import { DepositButton, WithdrawButton } from '@shared/react-components'
import classNames from 'classnames'
import { useAccount } from 'wagmi'

interface VaultButtonsProps {
  vault: Vault
  fullSized?: boolean
  inverseOrder?: boolean
  className?: string
}

export const VaultButtons = (props: VaultButtonsProps) => {
  const { vault, fullSized, inverseOrder, className } = props

  const { address: userAddress } = useAccount()

  const { data: vaultBalance } = useUserVaultShareBalance(vault, userAddress as `0x${string}`)

  const shareBalance = vaultBalance?.amount ?? 0n

  return (
    <div className={classNames('flex items-center gap-2', className)}>
      <DepositButton
        vault={vault}
        fullSized={fullSized}
        className={inverseOrder ? 'order-2' : 'order-1'}
      />
      {shareBalance > 0n && (
        <WithdrawButton
          vault={vault}
          fullSized={fullSized}
          className={inverseOrder ? 'order-1' : 'order-2'}
          color='transparent'
        />
      )}
    </div>
  )
}
