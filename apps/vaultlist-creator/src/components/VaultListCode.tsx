import { Spinner } from '@shared/ui'
import classNames from 'classnames'
import { useNewVaultList } from '@hooks/useNewVaultList'

interface VaultListCodeProps {
  className?: string
}

export const VaultListCode = (props: VaultListCodeProps) => {
  const { className } = props

  const { vaultList, isFetched } = useNewVaultList()

  return (
    <code className={classNames('', className)}>
      {isFetched ? JSON.stringify(vaultList, null, 2) : <Spinner />}
    </code>
  )
}
