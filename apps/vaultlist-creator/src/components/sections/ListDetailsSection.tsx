import classNames from 'classnames'
import { useAtomValue, useSetAtom } from 'jotai'
import { appViewAtom, listNameAtom } from 'src/atoms'
import { ListKeywordsForm } from '@components/forms/ListKeywordsForm'
import { PurpleButton } from '@components/PurpleButton'

interface ListDetailsSectionProps {
  className?: string
}

export const ListDetailsSection = (props: ListDetailsSectionProps) => {
  const { className } = props

  const setAppView = useSetAtom(appViewAtom)

  const listName = useAtomValue(listNameAtom)

  // TODO: disable preview until list is actually ready
  const isPreviewDisabled = false

  return (
    <section
      className={classNames(
        'flex flex-col gap-5 p-4 pr-16 border-r border-pt-purple-400',
        className
      )}
    >
      <h2 className='text-3xl text-pt-purple-100'>{listName}</h2>
      <span className='text-lg font-semibold text-pt-purple-300'>List Details</span>
      <ListKeywordsForm />
      <PurpleButton
        onClick={() => setAppView('preview')}
        className='self-start'
        disabled={isPreviewDisabled}
      >
        Preview Vault List
      </PurpleButton>
    </section>
  )
}
