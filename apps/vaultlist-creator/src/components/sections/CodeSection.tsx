import { Spinner } from '@shared/ui'
import classNames from 'classnames'
import { useLayoutEffect, useState } from 'react'
import { CopyButton } from '@components/buttons/CopyButton'
import { useNewVaultList } from '@hooks/useNewVaultList'

interface CodeSectionProps {
  className?: string
}

export const CodeSection = (props: CodeSectionProps) => {
  const { className } = props

  const { vaultList, isFetched } = useNewVaultList()

  const [isXOverflowing, setIsXOverflowing] = useState<boolean>(false)
  const [isYOverflowing, setIsYOverflowing] = useState<boolean>(false)

  useLayoutEffect(() => {
    const el = document.getElementById('code')
    if (!!el) {
      setIsXOverflowing(el.clientWidth < el.scrollWidth)
      setIsYOverflowing(el.clientHeight < el.scrollHeight)
    }
  }, [])

  return (
    <section className={classNames('flex flex-col gap-4 items-center', className)}>
      <h2 className='text-2xl font-medium'>Preview Your Vault List</h2>
      {isFetched && !!vaultList ? (
        <div className='relative w-full bg-gray-900 rounded-2xl'>
          <pre id='code' className='p-6 overflow-auto'>
            <code>{JSON.stringify(vaultList, null, 2)}</code>
          </pre>
          <CopyButton
            str={JSON.stringify(vaultList)}
            text='Copy Raw JSON'
            className={classNames('absolute', {
              'bottom-4': !isYOverflowing,
              'bottom-8': isYOverflowing,
              'right-4': !isXOverflowing,
              'right-8': isXOverflowing
            })}
          />
        </div>
      ) : (
        <Spinner />
      )}
    </section>
  )
}
