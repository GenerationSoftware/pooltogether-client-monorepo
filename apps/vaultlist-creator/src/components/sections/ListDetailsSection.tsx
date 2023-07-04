import { Button } from '@shared/ui'
import classNames from 'classnames'
import { useAtomValue, useSetAtom } from 'jotai'
import { appViewAtom, listNameAtom } from 'src/atoms'
import { ListKeywordsForm } from '@components/forms/ListKeywordsForm'

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
    <section className={classNames('flex flex-col', className)}>
      <h2 className=''>{listName}</h2>
      <span className=''>List Details</span>
      <ListKeywordsForm />
      <Button onClick={() => setAppView('preview')} disabled={isPreviewDisabled}>
        Preview Vault List
      </Button>
    </section>
  )
}
