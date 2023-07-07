import { Version } from '@shared/types'
import { Spinner } from '@shared/ui'
import { getVaultList } from '@shared/utilities'
import classNames from 'classnames'
import { useSetAtom } from 'jotai'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import {
  appViewAtom,
  listImageAtom,
  listKeywordsAtom,
  listNameAtom,
  listVersionAtom,
  vaultsAtom
} from 'src/atoms'
import { PurpleButton } from '@components/buttons/PurpleButton'
import { SimpleInput } from './SimpleInput'

interface ImportListFormValues {
  vaultListSrc: string
}

interface ImportListFormProps {
  className?: string
}

export const ImportListForm = (props: ImportListFormProps) => {
  const { className } = props

  const formMethods = useForm<ImportListFormValues>({ mode: 'onSubmit' })

  const setListName = useSetAtom(listNameAtom)
  const setListVersion = useSetAtom(listVersionAtom)
  const setListKeywords = useSetAtom(listKeywordsAtom)
  const setListImage = useSetAtom(listImageAtom)
  const setVaultInfo = useSetAtom(vaultsAtom)

  const setAppView = useSetAtom(appViewAtom)

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const onSubmit = async (data: ImportListFormValues) => {
    setIsLoading(true)
    formMethods.clearErrors('vaultListSrc')

    try {
      const vaultList = await getVaultList(data.vaultListSrc)

      if (!!vaultList) {
        const newVersion: Version = {
          major: vaultList.version.major,
          minor: vaultList.version.minor + 1,
          patch: vaultList.version.patch
        }
        const keywords = new Set(vaultList.keywords ?? [])
        const logoURI = vaultList.logoURI ?? ''

        setListName(vaultList.name)
        setListVersion(newVersion)
        setListKeywords(keywords)
        setListImage(logoURI)
        setVaultInfo(vaultList.tokens)
        setAppView('editing')
      } else {
        formMethods.setError('vaultListSrc', {
          message: "This doesn't seem like a valid vault list."
        })
      }
    } catch (err) {
      console.error(err)
      formMethods.setError('vaultListSrc', {
        message: 'Something went wrong while fetching the vault list.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <FormProvider {...formMethods}>
      <div className={classNames('flex flex-col items-center', className)}>
        <h3 className='mb-8 text-2xl font-semibold text-pt-purple-100'>Edit Existing Vault List</h3>
        <form
          onSubmit={formMethods.handleSubmit(onSubmit)}
          className='w-1/2 flex flex-col text-pt-purple-100'
        >
          <SimpleInput
            formKey='vaultListSrc'
            validate={{
              isValidURI: (v: string) =>
                !v ||
                v.startsWith('http://') ||
                v.startsWith('https://') ||
                v.startsWith('ipfs://') ||
                v.startsWith('ipns://') ||
                v.endsWith('.eth') ||
                'Not a valid URL or ENS domain.'
            }}
            placeholder='https:// or ipfs:// or ENS domain'
            label='Enter a URL or ENS domain'
            disabled={isLoading}
          />
          <PurpleButton
            type='submit'
            disabled={isLoading}
            className='mt-8 self-center'
            innerClassName='flex items-center justify-center'
          >
            <span className={classNames('text-base', { invisible: isLoading })}>
              Edit Vault List
            </span>
            <Spinner className={classNames('absolute', { hidden: !isLoading })} />
          </PurpleButton>
        </form>
      </div>
    </FormProvider>
  )
}
