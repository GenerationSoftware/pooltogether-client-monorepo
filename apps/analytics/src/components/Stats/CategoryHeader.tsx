import classNames from 'classnames'

interface CategoryHeaderProps {
  name: string
  className?: string
}

export const CategoryHeader = (props: CategoryHeaderProps) => {
  const { name, className } = props

  return (
    <h2 className={classNames('text-center text-3xl text-pt-purple-100 font-bold', className)}>
      {name}
    </h2>
  )
}
