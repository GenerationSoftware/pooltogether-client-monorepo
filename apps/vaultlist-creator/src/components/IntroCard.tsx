import classNames from 'classnames'

interface IntroCardProps {
  className?: string
}

export const IntroCard = (props: IntroCardProps) => {
  const { className } = props

  return (
    <div
      className={classNames(
        'flex flex-col p-4 text-sm bg-pt-purple-100 text-pt-purple-600 rounded-2xl lg:p-9 lg:text-xl',
        className
      )}
    >
      <span>This tool makes it easy to create and edit vault lists for PoolTogether.</span>
      <span>
        Vault lists are 100% compatible with{' '}
        <a href='https://tokenlists.org/' target='_blank' className='text-pt-purple-800 underline'>
          Uniswap's Token Lists
        </a>
        .
      </span>
    </div>
  )
}
