import { Spinner } from '@shared/ui'
import classNames from 'classnames'
import { CopyButton } from '@components/buttons/CopyButton'
import { useNewVaultList } from '@hooks/useNewVaultList'

interface CodeSectionProps {
  className?: string
}

export const CodeSection = (props: CodeSectionProps) => {
  const { className } = props

  const { vaultList, isFetched } = useNewVaultList()

  return (
    <section
      className={classNames('relative bg-pt-bg-purple-darker rounded-2xl shadow-2xl', className)}
    >
      {isFetched && !!vaultList ? (
        <>
          <pre className='max-h-[45vh] p-6 overflow-auto'>
            <code>{JSON.stringify(vaultList, null, 2)}</code>
          </pre>
          <CopyButton
            str={JSON.stringify(vaultList)}
            text='Copy Raw JSON'
            className='absolute bottom-4 right-8'
          />
        </>
      ) : (
        <Spinner />
      )}
    </section>
  )
}
