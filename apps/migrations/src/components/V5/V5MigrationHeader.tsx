import { useVault, useVaultTokenData } from '@generationsoftware/hyperstructure-react-hooks'
import classNames from 'classnames'
import { MigrationSteps } from '@components/MigrationSteps'
import { V5BalanceToMigrate } from '@hooks/useUserV5Balances'
import { V5MigrationStep } from './V5Migration'

export interface V5MigrationHeaderProps {
  migration: V5BalanceToMigrate
  actions: V5MigrationStep[]
  actionsCompleted: number
  className?: string
}

export const V5MigrationHeader = (props: V5MigrationHeaderProps) => {
  const { migration, actions, actionsCompleted, className } = props

  const vault = useVault(migration.vaultInfo)
  const { data: token } = useVaultTokenData(vault)

  const actionNames: Record<V5MigrationStep, string> = {
    claim: 'Claim Rewards',
    withdraw: `Withdraw ${token?.symbol ?? ''}`,
    swap: migration.token.chainId !== migration.destination.chainId ? 'Bridge & Swap' : 'Swap',
    deposit: 'Deposit Into V5'
  }

  return (
    <div className={classNames('flex flex-col gap-12 items-center text-center', className)}>
      <h2 className='font-averta font-semibold text-4xl'>
        {actionsCompleted >= actions.length ? (
          <span>Congrats, you've landed onto a better PoolTogether V5 vault!</span>
        ) : (
          <span>
            Migrate your <span className='text-pt-purple-400'>{migration.token.symbol}</span> to
            PoolTogether V5
          </span>
        )}
      </h2>
      <MigrationSteps
        actionNames={actions.map((action) => actionNames[action])}
        actionsCompleted={actionsCompleted}
      />
    </div>
  )
}
