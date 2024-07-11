import { Toggle } from '@shared/ui'
import { useAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import { ReactNode } from 'react'
import { isPermitDepositsDisabledAtom } from '@components/Modals/DepositModal'

export const MiscSettingsView = () => {
  const t = useTranslations('Settings')

  const [isPermitDepositsDisabled, setIsPermitDepositsDisabled] = useAtom(
    isPermitDepositsDisabledAtom
  )

  return (
    <div className='flex flex-col items-center gap-6'>
      <span className='text-lg font-semibold text-pt-purple-50 md:text-xl'>
        {t('otherSettings')}
      </span>

      <SettingToggle
        onChange={(checked) => setIsPermitDepositsDisabled(!checked)}
        checkedContent={t('permitApprovals.enabled')}
        uncheckedContent={t('permitApprovals.disabled')}
        isChecked={!isPermitDepositsDisabled}
      />
    </div>
  )
}

interface SettingToggleProps {
  onChange: (checked: boolean) => void
  checkedContent: ReactNode
  uncheckedContent: ReactNode
  isChecked?: boolean
}

const SettingToggle = (props: SettingToggleProps) => {
  const { onChange, checkedContent, uncheckedContent, isChecked } = props

  return (
    <div className='w-full flex items-center justify-between gap-2'>
      {isChecked ? checkedContent : uncheckedContent}
      <Toggle checked={!!isChecked} onChange={onChange} />
    </div>
  )
}
