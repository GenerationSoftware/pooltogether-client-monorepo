import { CheckIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import { V4BalanceToMigrate } from '@hooks/useUserV4Balances'

export interface V4MigrationHeaderProps {
  migration: V4BalanceToMigrate
  actions: ('claim' | 'swap')[]
  actionsCompleted: number
  className?: string
}

export const V4MigrationHeader = (props: V4MigrationHeaderProps) => {
  const { migration, actions, actionsCompleted, className } = props

  const actionNames = {
    claim: 'Claim Rewards',
    swap:
      migration.token.chainId !== migration.destination.chainId
        ? 'Bridge & Deposit Into V5'
        : 'Deposit Into V5'
  }

  return (
    <div className={classNames('flex flex-col gap-12 items-center text-center', className)}>
      <h2 className='font-averta font-semibold text-4xl'>
        {actionsCompleted >= actions.length ? (
          <span>Congrats, you've landed onto PoolTogether V5!</span>
        ) : (
          <span>
            Migrate your <span className='text-pt-purple-400'>{migration.token.symbol}</span> to
            PoolTogether V5
          </span>
        )}
      </h2>
      <div className='flex flex-col gap-3'>
        <div className='flex items-center justify-between isolate'>
          {actions.length > 1 &&
            [...Array(actions.length).keys()].map((i) => (
              <>
                <div className='w-32 flex justify-center'>
                  <div
                    className={classNames(
                      'relative h-6 w-6 flex items-center justify-center',
                      'border-4 border-gray-100/30 rounded-full',
                      {
                        'border-pt-pink': actionsCompleted >= i,
                        'bg-pt-pink': actionsCompleted > i
                      }
                    )}
                  >
                    <CheckIcon
                      className={classNames('h-5 w-5 stroke-[3] text-transparent', {
                        '!text-pt-pink-dark': actionsCompleted > i
                      })}
                    />
                    {i !== actions.length - 1 && (
                      <div
                        className='absolute left-[calc(100%+3px)] h-1 w-[calc(11rem-6px)] -z-10'
                        style={{
                          background:
                            actionsCompleted > i
                              ? 'repeating-linear-gradient(90deg, rgba(250, 72, 232, 1), rgba(250, 72, 232, 1) 8px, rgb(243 244 246 / 0.2) 8px, rgb(243 244 246 / 0.2) 16px)'
                              : 'repeating-linear-gradient(90deg, rgb(243 244 246 / 0.3), rgb(243 244 246 / 0.3) 8px, rgb(243 244 246 / 0.2) 8px, rgb(243 244 246 / 0.2) 16px)'
                        }}
                      />
                    )}
                  </div>
                </div>
              </>
            ))}
        </div>
        <div className='flex gap-16 items-center justify-between text-center'>
          {actions.map((action, i) => (
            <span
              className={classNames('w-32 text-xl font-semibold', {
                'w-auto': actions.length === 1
              })}
            >
              {actions.length > 1 ? `${i + 1}.` : ''} {actionNames[action]}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
