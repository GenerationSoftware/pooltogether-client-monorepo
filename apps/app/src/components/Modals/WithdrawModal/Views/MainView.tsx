import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useVaultExchangeRate,
  useVaultShareData
} from '@generationsoftware/hyperstructure-react-hooks'
import { PrizePoolBadge } from '@shared/react-components'
import { Spinner } from '@shared/ui'
import { getNiceNetworkNameByChainId } from '@shared/utilities'
import { useTranslations } from 'next-intl'
import { NetworkFees } from '../../NetworkFees'
import { WithdrawForm } from '../WithdrawForm'

interface MainViewProps {
  vault: Vault
}

export const MainView = (props: MainViewProps) => {
  const { vault } = props

  const t_common = useTranslations('Common')
  const t_modals = useTranslations('TxModals')

  const { data: shareData } = useVaultShareData(vault)

  const { data: vaultExchangeRate } = useVaultExchangeRate(vault)

  const vaultName = vault.name ?? `"${shareData?.name}"`
  const networkName = getNiceNetworkNameByChainId(vault.chainId)

  return (
    <div className='flex flex-col gap-6'>
      <span className='text-lg font-semibold text-center'>
        {!!vaultName && (
          <span className='hidden md:inline-block'>
            {t_modals('withdrawFrom', { name: vaultName, network: networkName })}
          </span>
        )}
        {!!vaultName && (
          <span className='inline-block md:hidden'>
            {t_modals('withdrawFromShort', { name: vaultName })}
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
          <WithdrawForm vault={vault} showInputInfoRows={true} />
          <NetworkFees vault={vault} show={['withdraw']} />
        </>
      )}
    </div>
  )
}
