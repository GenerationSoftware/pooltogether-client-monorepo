import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { useVaultShareData } from '@generationsoftware/hyperstructure-react-hooks'
import { PrizePoolBadge } from '@shared/react-components'
import { Button, Spinner } from '@shared/ui'
import { useTranslations } from 'next-intl'

interface WaitingViewProps {
  vault: Vault
  closeModal: () => void
}

export const WaitingView = (props: WaitingViewProps) => {
  const { vault, closeModal } = props

  const t_common = useTranslations('Common')
  const t_modals = useTranslations('TxModals')

  const { data: share } = useVaultShareData(vault)

  return (
    <div className='flex flex-col gap-4 md:gap-6'>
      <span className='text-lg font-semibold text-center'>{t_modals('confirmNotice')}</span>
      <PrizePoolBadge
        chainId={vault.chainId}
        hideBorder={true}
        intl={t_common}
        className='!py-1 mx-auto'
      />
      <span className='text-sm text-center md:text-base'>
        {t_modals('withdrawingFrom', { vault: share?.symbol ?? '?' })}
      </span>
      <Spinner size='lg' className='mx-auto after:border-y-pt-teal' />
      <div className='flex items-end h-24 md:h-36'>
        <Button fullSized={true} color='transparent' onClick={closeModal}>
          {t_common('close')}
        </Button>
      </div>
    </div>
  )
}
