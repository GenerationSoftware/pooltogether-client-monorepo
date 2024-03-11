import { useAtomValue } from 'jotai'
import { isUsingCustomYieldSourceAtom } from 'src/atoms'
import { CustomYieldSourceForm } from './forms/CustomYieldSourceForm'
import { YieldSourceForm } from './forms/YieldSourceForm'

interface YieldSourceViewProps {
  className?: string
}

export const YieldSourceView = (props: YieldSourceViewProps) => {
  const { className } = props

  const isUsingCustomYieldSource = useAtomValue(isUsingCustomYieldSourceAtom)

  if (isUsingCustomYieldSource) {
    return <CustomYieldSourceForm className={className} />
  }

  return <YieldSourceForm className={className} />
}
