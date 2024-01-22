import { CheckIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'

export interface MigrationStepsProps {
  actionNames: string[]
  actionsCompleted: number
  className?: string
}

export const MigrationSteps = (props: MigrationStepsProps) => {
  const { actionNames, actionsCompleted, className } = props

  return (
    <div className={classNames('flex flex-col gap-3', className)}>
      <div className='flex items-center justify-between isolate'>
        {actionNames.length > 1 &&
          [...Array(actionNames.length).keys()].map((i) => (
            <div key={`migration-step-graphic-${i}`} className='w-32 flex justify-center'>
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
                {i !== actionNames.length - 1 && (
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
          ))}
      </div>
      <div className='flex gap-16 justify-between text-center'>
        {actionNames.map((actionName, i) => (
          <span
            key={`migration-step-name-${i}`}
            className={classNames('w-32 text-xl font-semibold', {
              'w-auto': actionNames.length === 1
            })}
          >
            {actionNames.length > 1 ? `${i + 1}.` : ''} {actionName}
          </span>
        ))}
      </div>
    </div>
  )
}
