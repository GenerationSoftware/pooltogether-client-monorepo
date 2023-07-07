import classNames from 'classnames'
import { useSetAtom } from 'jotai'
import { appViewAtom, listNameAtom } from 'src/atoms'
import { isValidChars } from 'src/utils'
import { PurpleButton } from '@components/buttons/PurpleButton'
import { EditableText } from '@components/EditableText'
import { ListImageForm } from '@components/forms/ListImageForm'
import { ListKeywordsForm } from '@components/forms/ListKeywordsForm'
import { VaultListLogo } from '@components/VaultListLogo'
import { useAllVaultListData } from '@hooks/useAllVaultListData'

interface ListDetailsSectionProps {
  className?: string
}

export const ListDetailsSection = (props: ListDetailsSectionProps) => {
  const { className } = props

  const setAppView = useSetAtom(appViewAtom)

  const { name, filteredVaultInfo, isFetched } = useAllVaultListData()

  const setListName = useSetAtom(listNameAtom)

  const handleNameUpdate = (data: { text: string }) => {
    setListName(data.text.trim())
  }

  const isPreviewDisabled = !isFetched || filteredVaultInfo.length === 0

  return (
    <section
      className={classNames(
        'flex flex-col gap-5 p-4 pr-16 border-r border-pt-purple-400',
        className
      )}
    >
      <VaultListLogo />
      <EditableText
        value={name}
        onSubmit={handleNameUpdate}
        validate={{
          isNotFalsyString: (v: string) => !!v || 'Your vault list needs a name!',
          isValidString: (v: string) =>
            isValidChars(v, { allowSpaces: true }) || 'Invalid characters in name.'
        }}
        textClassName='!text-3xl !text-pt-purple-100'
      />
      <span className='text-lg font-semibold text-pt-purple-300'>List Details</span>
      <ListKeywordsForm />
      <ListImageForm />
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
