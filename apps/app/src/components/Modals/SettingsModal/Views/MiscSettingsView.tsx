import { useMiscSettings } from '@shared/generic-react-hooks'
import { Toggle } from '@shared/ui'
import { useTranslations } from 'next-intl'
import { ReactNode } from 'react'

export const MiscSettingsView = () => {
  const t = useTranslations('Settings')

  const { isActive: isPermitDepositsDisabled, set: setIsPermitDepositsDisabled } =
    useMiscSettings('permitDepositsDisabled')

  const { isActive: isEip5792Disabled, set: setIsEip5792Disabled } =
    useMiscSettings('eip5792Disabled')

  const { isActive: isEip7677Disabled, set: setIsEip7677Disabled } =
    useMiscSettings('eip7677Disabled')

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
      <SettingToggle
        onChange={(checked) => setIsEip5792Disabled(!checked)}
        checkedContent={t('eip5792.enabled')}
        uncheckedContent={t('eip5792.disabled')}
        isChecked={!isEip5792Disabled}
      />
      <SettingToggle
        onChange={(checked) => setIsEip7677Disabled(!checked)}
        checkedContent={t('eip7677.enabled')}
        uncheckedContent={t('eip7677.disabled')}
        isChecked={!isEip7677Disabled}
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
