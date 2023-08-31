import { PrizePool, Vault } from '@pooltogether/hyperstructure-client-js'
import { useVaultShareData } from '@pooltogether/hyperstructure-react-hooks'
import { Intl } from '@shared/types'
import { Spinner } from '@shared/ui'
import { getNiceNetworkNameByChainId } from '@shared/utilities'
import { useAtomValue } from 'jotai'
import { PrizePoolBadge } from '../../../Badges/PrizePoolBadge'
import { DepositForm, depositFormShareAmountAtom } from '../../../Form/DepositForm'
import { NetworkFees, NetworkFeesProps } from '../../NetworkFees'
import { Odds } from '../../Odds'

interface MainViewProps {
  vault: Vault
  prizePool: PrizePool
  intl?: {
    base?: Intl<
      'depositTo' | 'depositToShort' | 'balance' | 'max' | 'weeklyChances' | 'oneInXChance'
    >
    common?: Intl<'prizePool'>
    fees?: NetworkFeesProps['intl']
    formErrors?: Intl<'notEnoughTokens' | 'invalidNumber' | 'negativeNumber' | 'tooManyDecimals'>
  }
}

export const MainView = (props: MainViewProps) => {
  const { vault, prizePool, intl } = props

  const { data: shareData } = useVaultShareData(vault)

  const formShareAmount = useAtomValue(depositFormShareAmountAtom)

  const vaultName = vault.name ?? `"${shareData?.name}"`
  const networkName = getNiceNetworkNameByChainId(vault.chainId)

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
      <DepositForm vault={vault} showInputInfoRows={true} intl={intl} />
      {!!formShareAmount && (
        <div className='flex flex-col gap-4 mx-auto md:flex-row md:gap-9'>
          <Odds vault={vault} prizePool={prizePool} intl={intl?.base} />
          <NetworkFees vault={vault} show={['approve', 'deposit', 'withdraw']} intl={intl?.fees} />
        </div>
      )}
    </div>
  )
}
