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
    <section
      className={classNames('relative bg-pt-bg-purple-darker rounded-2xl shadow-2xl', className)}
    >
      {isFetched && !!vaultList ? (
        <>
          <pre id='code' className='max-h-[45vh] p-6 overflow-auto'>
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
        </>
      ) : (
        <Spinner />
      )}
    </section>
  )
}
