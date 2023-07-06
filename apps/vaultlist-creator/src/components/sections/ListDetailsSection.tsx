import classNames from 'classnames'
import { useSetAtom } from 'jotai'
import { appViewAtom } from 'src/atoms'
import { PurpleButton } from '@components/buttons/PurpleButton'
import { ListKeywordsForm } from '@components/forms/ListKeywordsForm'
import { useAllVaultListData } from '@hooks/useAllVaultListData'

interface ListDetailsSectionProps {
  className?: string
}

export const ListDetailsSection = (props: ListDetailsSectionProps) => {
  const { className } = props

  const setAppView = useSetAtom(appViewAtom)

  const { name, filteredVaultInfo, isFetched } = useAllVaultListData()

  const isPreviewDisabled = !isFetched || filteredVaultInfo.length === 0

  return (
    <section
      className={classNames(
        'flex flex-col gap-5 p-4 pr-16 border-r border-pt-purple-400',
        className
      )}
    >
      <h2 className='text-3xl text-pt-purple-100'>{name}</h2>
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
