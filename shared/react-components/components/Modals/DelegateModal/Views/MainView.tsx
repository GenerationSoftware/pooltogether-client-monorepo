import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useVaultExchangeRate,
  useVaultShareData
} from '@generationsoftware/hyperstructure-react-hooks'
import { Intl, RichIntl } from '@shared/types'
import { Spinner } from '@shared/ui'
import { getNiceNetworkNameByChainId } from '@shared/utilities'
import { formatUnits } from 'viem'
import { PrizePoolBadge } from '../../../Badges/PrizePoolBadge'
import { DelegateForm } from '../../../Form/DelegateForm'
import { AaveCollateralizationError } from '../../AaveCollateralizationError'
import { ExchangeRateError } from '../../ExchangeRateError'
import { NetworkFees, NetworkFeesProps } from '../../NetworkFees'

interface MainViewProps {
  vault: Vault
  intl?: {
    base?: Intl<'delegateFrom' | 'delegateFromShort' | 'balance' | 'max'>
    common?: Intl<'prizePool' | 'warning'>
    fees?: NetworkFeesProps['intl']
    errors?: RichIntl<
      | 'exchangeRateError'
      | 'aaveCollateralizationError.issue'
      | 'aaveCollateralizationError.recommendation'
      | 'aaveCollateralizationError.moreInfo'
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

  const isAaveCollateralizationErrored =
    vault.tags?.includes('aave') &&
    !!vaultExchangeRate &&
    vault.decimals !== undefined &&
    parseFloat(formatUnits(vaultExchangeRate, vault.decimals)) !== 1

  return (
    <div className='flex flex-col gap-6'>
      <span className='text-lg font-semibold text-center'>
        {!!vaultName && (
          <span className='hidden md:inline-block'>
            {intl?.base?.('delegateFrom', { name: vaultName, network: networkName }) ??
              `Delegate from ${vaultName} on ${networkName}`}
          </span>
        )}
        {!!vaultName && (
          <span className='inline-block md:hidden'>
            {intl?.base?.('delegateFromShort', { name: vaultName }) ?? `Delegate from ${vaultName}`}
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
          <DelegateForm vault={vault} showInputInfoRows={true} intl={intl} />
          {isAaveCollateralizationErrored ? (
            <AaveCollateralizationError
              vault={vault}
              intl={{ warning: intl?.common?.('warning'), error: intl?.errors }}
            />
          ) : (
            <NetworkFees vault={vault} show={['delegate']} intl={intl?.fees} />
          )}
        </>
      ) : (
        <ExchangeRateError vault={vault} intl={intl?.errors} />
      )}
    </div>
  )
}
