import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { useVaultShareData } from '@generationsoftware/hyperstructure-react-hooks'
import { Intl, RichIntl } from '@shared/types'
import { Spinner } from '@shared/ui'
import { getNiceNetworkNameByChainId } from '@shared/utilities'
import { useAccount } from 'wagmi'
import { DelegateForm } from '../../Form/DelegateForm'
import { NetworkFeesProps } from '../NetworkFees'
import { DelegateModalView } from './index'

interface DelegateModalBodyProps {
  vault: Vault
  modalView: DelegateModalView
  intl?: {
    base?: Intl<
      | 'delegateFrom'
      | 'delegateFromShort'
      | 'delegateDescription'
      | 'changeDelegateAddress'
      | 'delegatedAddress'
    >
    common?: Intl<'prizePool' | 'warning'>
    fees?: NetworkFeesProps['intl']
    errors?: RichIntl<'formErrors.invalidAddress' | 'formErrors.sameAsDelegate'>
  }
}

export const DelegateModalBody = (props: DelegateModalBodyProps) => {
  const { vault, modalView, intl } = props

  const { isDisconnected } = useAccount()

  const { data: shareData } = useVaultShareData(vault)

  const vaultName = vault.name ?? `"${shareData?.name}"`
  const vaultToken = vault.tokenData?.symbol ?? `"${shareData?.name}"`
  const networkName = getNiceNetworkNameByChainId(vault.chainId)

  if (isDisconnected) {
    return null
  } else {
    return (
      <div className='flex flex-col gap-6'>
        <span className='text-lg font-semibold text-center'>
          {!!vaultName && (
            <span className='hidden md:inline-block'>
              {intl?.base?.('delegateFrom', { name: vaultName, network: networkName }) ??
                `Delegate your ${vaultName} on ${networkName}`}
            </span>
          )}
          {!!vaultName && (
            <span className='inline-block md:hidden'>
              {intl?.base?.('delegateFromShort', { name: vaultName }) ??
                `Delegate your ${vaultName}`}
            </span>
          )}
          {!!vaultName && (
            <span className='text-sm my-2 font-normal text-pt-purple-200 block'>
              {intl?.base?.('delegateDescription', { tokens: vaultToken }) ??
                `The delegated address receives any prizes your ${vaultToken} deposit wins.`}
            </span>
          )}

          {!vaultName && <Spinner />}
        </span>

        <DelegateForm modalView={modalView} vault={vault} intl={intl} />
      </div>
    )
  }
}
