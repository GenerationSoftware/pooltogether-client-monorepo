import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { useSortedVaults } from '@generationsoftware/hyperstructure-react-hooks'
import { Spinner } from '@shared/ui'
import classNames from 'classnames'
import { VaultCard } from './VaultCard'

interface VaultsCardsProps {
  vaults: Vault[]
  className?: string
}

export const VaultCards = (props: VaultsCardsProps) => {
  const { vaults, className } = props

  // TODO: fix this hook (currently requires passing prizepool and twabrewards to fully sort)
  const { sortedVaults, isFetched } = useSortedVaults(vaults)

  if (!isFetched) {
    return <Spinner className={className} />
  }

  return (
    <div className={classNames('w-full max-w-[36rem] flex flex-col gap-4', className)}>
      {sortedVaults.map((vault) => (
        <VaultCard key={vault.id} vault={vault} />
      ))}
    </div>
  )
}
