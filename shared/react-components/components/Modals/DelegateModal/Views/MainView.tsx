import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { useVaultShareData } from '@generationsoftware/hyperstructure-react-hooks'
import { Intl, RichIntl } from '@shared/types'
import { Spinner } from '@shared/ui'
import { getNiceNetworkNameByChainId } from '@shared/utilities'
import { DelegateForm } from '../../../Form/DelegateForm'
import { NetworkFees, NetworkFeesProps } from '../../NetworkFees'

interface MainViewProps {
  vault: Vault
  intl?: {
    base?: Intl<'delegateFrom' | 'delegateFromShort' | 'delegateDescription'>
    common?: Intl<'prizePool' | 'warning'>
    fees?: NetworkFeesProps['intl']
    errors?: RichIntl<'formErrors.invalidAddress'>
  }
}

export const MainView = (props: MainViewProps) => {
  const { vault, intl } = props

  const { data: shareData } = useVaultShareData(vault)

  const vaultName = vault.name ?? `"${shareData?.name}"`
  const vaultToken = vault.tokenData?.symbol ?? `"${shareData?.name}"`
  const networkName = getNiceNetworkNameByChainId(vault.chainId)

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
            {intl?.base?.('delegateFromShort', { name: vaultName }) ?? `Delegate your ${vaultName}`}
          </span>
        )}
        {!!vaultName && (
          <span className='text-sm my-2 font-normal text-pt-purple-200 block'>
            {intl?.base?.('delegateDescription', { tokenSymbol: vaultToken }) ??
              `The delegated address receives any prizes your ${vaultToken} deposit wins.`}
          </span>
        )}

        {!vaultName && <Spinner />}
      </span>
      <>
        <DelegateForm vault={vault} intl={intl} />
        {/* <NetworkFees vault={vault} show={['delegate']} intl={intl?.fees} /> */}
      </>
    </div>
  )
}
