import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { Spinner, Tooltip } from '@shared/ui'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { useVaultWinChance } from '@hooks/useVaultWinChance'

interface VaultWinChanceProps {
  vault: Vault
  className?: string
  tooltipClassName?: string
}

export const VaultWinChance = (props: VaultWinChanceProps) => {
  const { vault, className, tooltipClassName } = props

  const { data: winChance, isFetched: isFetchedWinChance } = useVaultWinChance(vault)

  if (!isFetchedWinChance) {
    return <Spinner />
  }

  if (winChance === undefined) {
    return <>?</>
  }

  return (
    <WinChanceGraphic
      winChance={winChance}
      className={className}
      tooltipClassName={tooltipClassName}
    />
  )
}

interface WinChanceGraphicProps {
  winChance: number
  className?: string
  tooltipClassName?: string
}

const WinChanceGraphic = (props: WinChanceGraphicProps) => {
  const { winChance, className, tooltipClassName } = props

  const t = useTranslations('Tooltips.winChanceChart')

  const fill = (minWinChance: number) => {
    return !!winChance && winChance >= minWinChance ? '#B18CFF' : '#F5F0FF1A'
  }

  const tooltipContent = useMemo(() => {
    if (winChance >= 0.75) {
      return t('highest')
    } else if (winChance >= 0.5) {
      return t('high')
    } else if (winChance >= 0.25) {
      return t('average')
    } else if (winChance >= 0.1) {
      return t('low')
    } else if (winChance > 0) {
      return t('lowest')
    } else {
      return t('none')
    }
  }, [winChance])

  return (
    <Tooltip content={<span className={tooltipClassName}>{tooltipContent}</span>}>
      <svg
        width='54'
        height='30'
        viewBox='0 0 54 30'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        className={className}
      >
        <rect x='0.5' y='24' width='9' height='6' fill={fill(0)} />
        <rect x='11.5' y='18' width='9' height='12' fill={fill(0.1)} />
        <rect x='22.5' y='12' width='9' height='18' fill={fill(0.25)} />
        <rect x='33.5' y='6' width='9' height='24' fill={fill(0.5)} />
        <rect x='44.5' width='9' height='30' fill={fill(0.75)} />
      </svg>
    </Tooltip>
  )
}
