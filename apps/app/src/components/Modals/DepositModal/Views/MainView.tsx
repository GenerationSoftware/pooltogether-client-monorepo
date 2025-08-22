import { PrizePool, Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useVaultExchangeRate,
  useVaultShareData,
  useVaultTokenAddress
} from '@generationsoftware/hyperstructure-react-hooks'
import { useMiscSettings } from '@shared/generic-react-hooks'
import { AlertIcon, PrizePoolBadge } from '@shared/react-components'
import { Spinner } from '@shared/ui'
import {
  DOLPHIN_ADDRESS,
  getNiceNetworkNameByChainId,
  lower,
  supportsEip5792
} from '@shared/utilities'
import { useAtomValue } from 'jotai'
import { useTranslations } from 'next-intl'
import { useCapabilities } from 'wagmi'
import { NetworkFees, NetworkFeesProps } from '../../NetworkFees'
import { Odds } from '../../Odds'
import {
  DepositForm,
  depositFormShareAmountAtom,
  depositFormTokenAddressAtom
} from '../DepositForm'

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

  const { data: vaultExchangeRate } = useVaultExchangeRate(vault)

  const vaultName = vault.name ?? share?.name
  const networkName = getNiceNetworkNameByChainId(vault.chainId)

  const isZapping =
    !!vaultTokenAddress &&
    !!formTokenAddress &&
    lower(vaultTokenAddress) !== lower(formTokenAddress)

  const { data: walletCapabilities } = useCapabilities()
  const chainWalletCapabilities = walletCapabilities?.[vault.chainId] ?? {}

  const { isActive: isEip5792Disabled } = useMiscSettings('eip5792Disabled')
  const isUsingEip5792 = supportsEip5792(chainWalletCapabilities) && !isEip5792Disabled

  const feesToShow: NetworkFeesProps['show'] = isZapping
    ? lower(formTokenAddress) === DOLPHIN_ADDRESS
      ? ['depositWithZap', 'withdraw']
      : ['approve', 'depositWithZap', 'withdraw']
    : isUsingEip5792
    ? ['approve+deposit', 'withdraw']
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
          <DepositForm vault={vault} showInputInfoRows={true} />
          {!!formShareAmount ? (
            <div className='flex flex-col gap-4 mx-auto md:flex-row md:gap-9'>
              <Odds vault={vault} prizePool={prizePool} />
              <NetworkFees vault={vault} show={feesToShow} />
            </div>
          ) : (
            <RisksDisclaimer vault={vault} />
          )}
        </>
      )}
    </div>
  )
}

interface RisksDisclaimerProps {
  vault: Vault
}

const RisksDisclaimer = (props: RisksDisclaimerProps) => {
  const { vault } = props

  const t_common = useTranslations('Common')
  const t_modals = useTranslations('TxModals')

  const vaultHref = `/vault/${vault.chainId}/${vault.address}`

  return (
    <div className='w-full flex flex-col gap-4 p-6 text-pt-purple-100 bg-pt-transparent rounded-lg lg:items-center'>
      <div className='flex gap-2 items-center'>
        <AlertIcon className='w-5 h-5' />
        <span className='text-xs font-semibold lg:text-sm'>{t_common('learnAboutRisks')}</span>
      </div>
      <span className='text-xs lg:text-center lg:text-sm'>
        {t_modals.rich('risksDisclaimer', {
          vaultLink: (chunks) => (
            <a href={vaultHref} target='_blank' className='text-pt-purple-300'>
              {chunks}
            </a>
          )
        })}
      </span>
    </div>
  )
}
