import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useUserVaultDelegate,
  useVaultShareData,
  useVaultTokenAddress
} from '@generationsoftware/hyperstructure-react-hooks'
import { TokenWithLogo } from '@shared/types'
import { Intl, RichIntl } from '@shared/types'
import { Spinner } from '@shared/ui'
import { getNiceNetworkNameByChainId } from '@shared/utilities'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { DelegateForm } from '../../Form/DelegateForm'
import { NetworkIcon } from '../../Icons/NetworkIcon'
import { TokenIcon } from '../../Icons/TokenIcon'
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
      | 'delegateSelfDescription'
      | 'changeDelegateAddress'
      | 'changeDelegateAddressShort'
      | 'delegatedAddress'
    >
    tooltip?: Intl<'delegateDescription'>
    common?: Intl<'prizePool' | 'warning' | 'learnMore'>
    fees?: NetworkFeesProps['intl']
    errors?: RichIntl<'formErrors.invalidAddress' | 'formErrors.sameAsDelegate'>
  }
}

export const DelegateModalBody = (props: DelegateModalBodyProps) => {
  const { vault, modalView, intl } = props

  const { address: userAddress, isDisconnected } = useAccount()

  const { data: shareData } = useVaultShareData(vault)

  const { data: delegate } = useUserVaultDelegate(vault, userAddress as Address, {
    refetchOnWindowFocus: true
  })

  const vaultName = vault.name ?? `"${shareData?.name}"`
  const vaultToken = vault.tokenData?.symbol ?? `"${shareData?.name}"`
  const networkName = getNiceNetworkNameByChainId(vault.chainId)

  const delegatedToSelf = delegate?.toLowerCase() === userAddress?.toLowerCase()

  const { data: tokenAddress } = useVaultTokenAddress(vault)

  const token: Partial<TokenWithLogo> = {
    chainId: vault.chainId,
    address: !!vault.logoURI ? vault.address : vault.tokenAddress ?? tokenAddress,
    name: vault.name ?? shareData?.name,
    symbol: vault.shareData?.symbol ?? shareData?.symbol,
    logoURI: vault.logoURI ?? vault.tokenLogoURI
  }

  if (isDisconnected) {
    return null
  } else {
    return (
      <div className='flex flex-col gap-6'>
        <span className='text-lg font-semibold text-center'>
          {!!vaultName && (
            <div className='flex flex-col items-center'>
              <div className='relative pb-3 shrink-0'>
                <TokenIcon token={token} />
                <NetworkIcon chainId={vault.chainId} className='absolute top-4 left-4 h-3 w-3' />
              </div>
              <span className='hidden md:inline-block'>
                {intl?.base?.('delegateFrom', { name: vaultName, network: networkName }) ??
                  `Delegate your ${vaultName} on ${networkName}`}
              </span>
              <span className='inline-block md:hidden text-sm'>
                {intl?.base?.('delegateFromShort', { name: vaultName }) ??
                  `Delegate your ${vaultName}`}
              </span>
            </div>
          )}

          <span className='text-xs sm:text-sm my-2 font-normal text-pt-purple-200 block'>
            {!!vaultName && delegatedToSelf
              ? intl?.base?.('delegateSelfDescription', { tokens: vaultToken }) ??
                `You are delegating to yourself. Any prize your ${vaultToken} deposit wins will go to your wallet..`
              : intl?.base?.('delegateDescription', { tokens: vaultToken }) ??
                `The delegated address receives any prizes your ${vaultToken} deposit wins.`}
          </span>

          {!vaultName && <Spinner />}
        </span>

        <DelegateForm modalView={modalView} vault={vault} intl={intl} />
      </div>
    )
  }
}
