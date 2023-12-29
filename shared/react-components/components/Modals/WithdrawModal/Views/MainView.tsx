import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useVaultExchangeRate,
  useVaultShareData
} from '@generationsoftware/hyperstructure-react-hooks'
import { Intl, RichIntl } from '@shared/types'
import { ExternalLink, LINKS, Spinner } from '@shared/ui'
import { getNetworkNameByChainId, getNiceNetworkNameByChainId } from '@shared/utilities'
import { formatUnits } from 'viem'
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
          {vault.decimals !== undefined &&
            parseFloat(formatUnits(vaultExchangeRate, vault.decimals)) !== 1 && (
              <TemporaryAaveCollaterizationWarning vault={vault} />
            )}
          <NetworkFees vault={vault} show={['withdraw']} intl={intl?.fees} />
        </>
      ) : (
        <ExchangeRateError vault={vault} intl={intl?.errors} />
      )}
    </div>
  )
}

// TODO: remove once no longer an issue
const TemporaryAaveCollaterizationWarning = (props: { vault: Vault }) => {
  const { vault } = props

  const networkName = getNetworkNameByChainId(vault.chainId)
  const uniswapHref = `https://app.uniswap.org/tokens/${networkName}/${vault.address}`

  return (
    <span className='text-center text-sm text-pt-purple-200'>
      <span>
        This vault is currently experiencing some exchange rate variation due to using a high % of
        it's underlying yield source's total supply. It is <strong>not recommended</strong> to
        withdraw at this time.
      </span>
      <span>
        You can still swap in and out of this vault through{' '}
        <ExternalLink href={uniswapHref} size='sm' className='text-pt-teal'>
          UniSwap
        </ExternalLink>
        , wait for it to normalize or for further updates on{' '}
        <ExternalLink href={LINKS.discord} size='sm' className='text-pt-teal'>
          Discord
        </ExternalLink>
        .
      </span>
    </span>
  )
}
