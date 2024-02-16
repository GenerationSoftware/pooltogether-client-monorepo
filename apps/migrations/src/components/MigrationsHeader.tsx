import classNames from 'classnames'

export interface MigrationsHeaderProps {
  className?: string
}

export const MigrationsHeader = (props: MigrationsHeaderProps) => {
  const { className } = props

  return (
    <div className={classNames('w-full flex flex-col items-center text-center', className)}>
      <h1 className='font-averta font-semibold text-[2.5rem]'>
        <span className='text-pt-purple-400'>Migrate</span> to PoolTogether V5
      </h1>
      <span>PoolTogether versions 3 and 4 have been deprecated, withdraw or migrate below:</span>
    </div>
  )
}
