import { Accordion } from '@shared/ui'
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
        'flex flex-col gap-5 px-6 py-4 border-pt-purple-400 lg:pl-4 lg:pr-16 lg:border-r',
        className
      )}
    >
      <VaultListLogo />
      <VaultListDetailsAccordion name={name} className='lg:hidden' />
      <EditableText
        value={name}
        onSubmit={handleNameUpdate}
        validate={{
          isNotFalsyString: (v: string) => !!v || 'Your vault list needs a name!',
          isValidString: (v: string) =>
            isValidChars(v, { allowSpaces: true }) || 'Invalid characters in name.'
        }}
        className='hidden lg:block'
        textClassName='!text-3xl !text-pt-purple-100 !rounded-lg'
      />
      <span className='hidden text-lg font-semibold text-pt-purple-300 lg:block'>List Details</span>
      <ListImageForm className='hidden lg:block' />
      <ListKeywordsForm className='hidden lg:block' />
      <div className='w-full fixed bottom-0 left-0 self-start flex justify-center p-3 bg-pt-purple-100 z-40 lg:w-auto lg:static lg:p-0 lg:bg-transparent lg:z-auto'>
        <PurpleButton onClick={() => setAppView('preview')} disabled={isPreviewDisabled}>
          Preview Vault List
        </PurpleButton>
      </div>
    </section>
  )
}

interface VaultListDetailsAccordionProps {
  name: string
  className?: string
}

const VaultListDetailsAccordion = (props: VaultListDetailsAccordionProps) => {
  const { name, className } = props

  return (
    <Accordion
      items={[
        {
          id: 'vaultListDetails',
          title: <span className='text-lg'>{name}</span>,
          content: (
            <div className='flex flex-col gap-2 my-2'>
              <ListImageForm />
              <ListKeywordsForm />
            </div>
          )
        }
      ]}
      collapseAll={true}
      className={className}
    />
  )
}
