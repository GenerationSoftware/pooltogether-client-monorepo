import classNames from 'classnames'

interface TermsOfServiceProps {
  className?: string
}

export const TermsOfService = (props: TermsOfServiceProps) => {
  const { className } = props

  const h2ClassName = 'text-2xl font-medium'
  const h3ClassName = 'font-medium'

  return (
    <div className={classNames('flex flex-col gap-3', className)}>
      <h2 className={h2ClassName}>Terms of Use</h2>
      <span>WIP</span>
    </div>
  )
}
