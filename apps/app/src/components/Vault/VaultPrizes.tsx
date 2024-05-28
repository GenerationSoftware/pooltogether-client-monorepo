import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { useAllPrizeValue } from '@generationsoftware/hyperstructure-react-hooks'
import { CurrencyValue } from '@shared/react-components'
import { Spinner } from '@shared/ui'
import classNames from 'classnames'
import { useSupportedPrizePools } from '@hooks/useSupportedPrizePools'

interface VaultPrizesProps {
  vault: Vault
  className?: string
}

export const VaultPrizes = (props: VaultPrizesProps) => {
  const { vault, className } = props

  const prizePools = useSupportedPrizePools()
  const prizePool = Object.values(prizePools).find((pool) => pool.chainId === vault.chainId)

  const { data: allPrizeValue } = useAllPrizeValue(!!prizePool ? [prizePool] : [])
  const prizeValue = !!prizePool ? allPrizeValue[prizePool.id] : undefined

  if (!prizeValue) {
    return <Spinner />
  }

  return (
    <div className={classNames('text-sm text-pt-purple-100', className)}>
      up to{' '}
      <span className='text-lg font-semibold'>
        <CurrencyValue baseValue={prizeValue} hideZeroes={true} />
      </span>
    </div>
  )
}
