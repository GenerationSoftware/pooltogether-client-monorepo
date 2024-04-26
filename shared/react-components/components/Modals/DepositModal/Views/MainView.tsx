import { PrizePool, Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useTokenPermitSupport,
  useVaultExchangeRate,
  useVaultShareData,
  useVaultTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import { Intl, RichIntl } from '@shared/types'
import { Spinner } from '@shared/ui'
import { getNiceNetworkNameByChainId } from '@shared/utilities'
import { useAtomValue } from 'jotai'
import { Address } from 'viem'
import { PrizePoolBadge } from '../../../Badges/PrizePoolBadge'
import { DepositForm, depositFormShareAmountAtom } from '../../../Form/DepositForm'
import { NetworkFees, NetworkFeesProps } from '../../NetworkFees'
import { Odds } from '../../Odds'
import { LpSource } from '../LpSource'

interface MainViewProps {
  vault: Vault
  prizePool: PrizePool
  intl?: {
    base?: Intl<
      'depositTo' | 'depositToShort' | 'balance' | 'max' | 'weeklyChances' | 'oneInXChance'
    >
    common?: Intl<'prizePool' | 'getTokenAt'>
    fees?: NetworkFeesProps['intl']
    errors?: RichIntl<
      | 'formErrors.notEnoughTokens'
      | 'formErrors.invalidNumber'
      | 'formErrors.negativeNumber'
      | 'formErrors.tooManyDecimals'
    >
  }
}

export const MainView = (props: MainViewProps) => {
  const { vault, prizePool, intl } = props

  const { data: shareData } = useVaultShareData(vault)
  const { data: tokenData } = useVaultTokenData(vault)

  const { data: tokenPermitSupport } = useTokenPermitSupport(
    tokenData?.chainId as number,
    tokenData?.address as Address
  )

  const { data: vaultExchangeRate } = useVaultExchangeRate(vault)

  const formShareAmount = useAtomValue(depositFormShareAmountAtom)

  const vaultName = vault.name ?? `"${shareData?.name}"`
  const networkName = getNiceNetworkNameByChainId(vault.chainId)

  const feesToShow: NetworkFeesProps['show'] =
    tokenPermitSupport === 'eip2612'
      ? ['depositWithPermit', 'withdraw']
      : ['approve', 'deposit', 'withdraw']

  return (
    <div className='flex flex-col gap-6'>
      <span className='text-lg font-semibold text-center'>
        {!!vaultName && (
          <span className='hidden md:inline-block'>
            {intl?.base?.('depositTo', { name: vaultName, network: networkName }) ??
              `Deposit to ${vaultName} on ${networkName}`}
          </span>
        )}
        {!!vaultName && (
          <span className='inline-block md:hidden'>
            {intl?.base?.('depositToShort', { name: vaultName }) ?? `Deposit to ${vaultName}`}
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
      {/* TODO: add flow for when exchange rate cannot be found */}
      {!!vaultExchangeRate && (
        <>
          <LpSource vault={vault} intl={intl?.common} />
          <DepositForm vault={vault} showInputInfoRows={true} intl={intl} />
          {!!formShareAmount && (
            <div className='flex flex-col gap-4 mx-auto md:flex-row md:gap-9'>
              <Odds vault={vault} prizePool={prizePool} intl={intl?.base} />
              <NetworkFees vault={vault} show={feesToShow} intl={intl?.fees} />
            </div>
          )}
        </>
      )}
    </div>
  )
}
