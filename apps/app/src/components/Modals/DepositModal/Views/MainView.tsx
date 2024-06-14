import { PrizePool, Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useTokenPermitSupport,
  useVaultExchangeRate,
  useVaultShareData,
  useVaultTokenAddress
} from '@generationsoftware/hyperstructure-react-hooks'
import { PrizePoolBadge } from '@shared/react-components'
import { Spinner } from '@shared/ui'
import { DOLPHIN_ADDRESS, getNiceNetworkNameByChainId, lower } from '@shared/utilities'
import { useAtomValue } from 'jotai'
import { useTranslations } from 'next-intl'
import { NetworkFees, NetworkFeesProps } from '../../NetworkFees'
import { Odds } from '../../Odds'
import {
  DepositForm,
  depositFormShareAmountAtom,
  depositFormTokenAddressAtom
} from '../DepositForm'
import { LpSource } from '../LpSource'

interface MainViewProps {
  vault: Vault
  prizePool: PrizePool
}

export const MainView = (props: MainViewProps) => {
  const { vault, prizePool } = props

  const t_common = useTranslations('Common')
  const t_txModals = useTranslations('TxModals')

  const { data: share } = useVaultShareData(vault)
  const { data: vaultTokenAddress } = useVaultTokenAddress(vault)

  const formTokenAddress = useAtomValue(depositFormTokenAddressAtom)
  const formShareAmount = useAtomValue(depositFormShareAmountAtom)

  const tokenAddress = formTokenAddress ?? vaultTokenAddress

  const { data: tokenPermitSupport } = useTokenPermitSupport(vault.chainId, tokenAddress!)

  const { data: vaultExchangeRate } = useVaultExchangeRate(vault)

  const vaultName = vault.name ?? share?.name
  const networkName = getNiceNetworkNameByChainId(vault.chainId)

  const isZapping =
    !!vaultTokenAddress &&
    !!formTokenAddress &&
    lower(vaultTokenAddress) !== lower(formTokenAddress)

  const feesToShow: NetworkFeesProps['show'] = isZapping
    ? lower(formTokenAddress) === DOLPHIN_ADDRESS
      ? ['depositWithZap', 'withdraw']
      : ['approve', 'depositWithZap', 'withdraw']
    : tokenPermitSupport === 'eip2612'
    ? ['depositWithPermit', 'withdraw']
    : ['approve', 'deposit', 'withdraw']

  return (
    <div className='flex flex-col gap-6'>
      <span className='text-lg font-semibold text-center'>
        {!!vaultName && (
          <span className='hidden md:inline-block'>
            {t_txModals('depositTo', { name: vaultName, network: networkName })}
          </span>
        )}
        {!!vaultName && (
          <span className='inline-block md:hidden'>
            {t_txModals('depositToShort', { name: vaultName })}
          </span>
        )}
        {!vaultName && <Spinner />}
      </span>
      <PrizePoolBadge
        chainId={vault.chainId}
        hideBorder={true}
        intl={t_common}
        className='!py-1 mx-auto'
      />
      {/* TODO: add flow for when exchange rate cannot be found */}
      {!!vaultExchangeRate && (
        <>
          <LpSource vault={vault} />
          <DepositForm vault={vault} showInputInfoRows={true} />
          {!!formShareAmount && (
            <div className='flex flex-col gap-4 mx-auto md:flex-row md:gap-9'>
              <Odds vault={vault} prizePool={prizePool} />
              <NetworkFees vault={vault} show={feesToShow} />
            </div>
          )}
        </>
      )}
    </div>
  )
}
