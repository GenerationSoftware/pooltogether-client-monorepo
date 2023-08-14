import classNames from 'classnames'
import { DocsSection } from './DocsSection'
import { StartBuildingSection } from './StartBuildingSection'

interface ToolsContentProps {
  className?: string
}

export const ToolsContent = (props: ToolsContentProps) => {
  const { className } = props

  return (
    <div className={classNames('w-full flex flex-col gap-52 items-center px-16', className)}>
      <StartBuildingSection className='max-w-[1440px]' />
      <DocsSection />
    </div>
  )
}
