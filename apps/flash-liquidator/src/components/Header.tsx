import classNames from 'classnames'

interface HeaderProps {
  className?: string
}

export const Header = (props: HeaderProps) => {
  const { className } = props

  return (
    <div className={classNames('flex flex-col gap-2 items-center text-center', className)}>
      <h1 className='text-3xl'>TODO: main header</h1>
      <p className='text-sm font-semibold text-pt-purple-300'>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis optio saepe odit dolorum
        beatae. Laboriosam perferendis non ratione impedit, optio voluptas cumque temporibus
        voluptatum quos facere. Impedit adipisci neque perferendis.
      </p>
    </div>
  )
}
