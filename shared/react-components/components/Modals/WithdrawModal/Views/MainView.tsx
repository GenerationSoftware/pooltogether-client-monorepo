import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useVaultExchangeRate,
  useVaultShareData
} from '@generationsoftware/hyperstructure-react-hooks'
import { Intl, RichIntl } from '@shared/types'
import { Spinner } from '@shared/ui'
import { getNiceNetworkNameByChainId } from '@shared/utilities'
import { PrizePoolBadge } from '../../../Badges/PrizePoolBadge'
import { WithdrawForm } from '../../../Form/WithdrawForm'
import { ExchangeRateError } from '../../ExchangeRateError'
import { NetworkFees, NetworkFeesProps } from '../../NetworkFees'

interface MainViewProps {
  vault: Vault
  intl?: {
    base?: Intl<'withdrawFrom' | 'withdrawFromShort' | 'balance' | 'max'>
    common?: Intl<'prizePool'>
    fees?: NetworkFeesProps['intl']
    errors?: RichIntl<
      | 'exchangeRateError'
      | 'formErrors.notEnoughTokens'
      | 'formErrors.invalidNumber'
      | 'formErrors.negativeNumber'
      | 'formErrors.tooManyDecimals'
    >
  }
}

export const MainView = (props: MainViewProps) => {
  const { vault, intl } = props

  const { data: shareData } = useVaultShareData(vault)

  const { data: vaultExchangeRate } = useVaultExchangeRate(vault)

  const vaultName = vault.name ?? `"${shareData?.name}"`
  const networkName = getNiceNetworkNameByChainId(vault.chainId)

  return (
    <div className='flex flex-col gap-6'>
      <span className='text-lg font-semibold text-center'>
        {!!vaultName && (
          <span className='hidden md:inline-block'>
            {intl?.base?.('withdrawFrom', { name: vaultName, network: networkName }) ??
              `Withdraw from ${vaultName} on ${networkName}`}
          </span>
        )}
        {!!vaultName && (
          <span className='inline-block md:hidden'>
            {intl?.base?.('withdrawFromShort', { name: vaultName }) ?? `Withdraw from ${vaultName}`}
          </span>
        )}
        {!vaultName && <Spinner />}
      </span>
      <PrizePoolBadge
        chainId={vault.chainId}
        hideBorder={true}
        intl={intl?.common}
        className='!py-1 mx-auto'
      />
      {!!vaultExchangeRate ? (
        <>
          <WithdrawForm vault={vault} showInputInfoRows={true} intl={intl} />
          <NetworkFees vault={vault} show={['withdraw']} intl={intl?.fees} />
        </>
      ) : (
        <ExchangeRateError vault={vault} intl={intl?.errors} />
      )}
    </div>
  )
}
