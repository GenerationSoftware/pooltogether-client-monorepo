import { XMarkIcon } from '@heroicons/react/24/solid'
import classNames from 'classnames'
import { useAtom } from 'jotai'
import { FormProvider, useForm } from 'react-hook-form'
import { listKeywordsAtom } from 'src/atoms'
import { SimpleInput } from './SimpleInput'

interface ListKeywordsFormValues {
  vaultListKeyword: string
}

interface ListKeywordsFormProps {
  className?: string
}

export const ListKeywordsForm = (props: ListKeywordsFormProps) => {
  const { className } = props

  const formMethods = useForm<ListKeywordsFormValues>({ mode: 'onSubmit' })

  const [keywords, setKeywords] = useAtom(listKeywordsAtom)

  const addKeyword = (newKeyword: string) => {
    const newKeywordSet = new Set<string>(keywords)
    newKeywordSet.add(newKeyword)
    setKeywords(newKeywordSet)
  }

  const deleteKeyword = (oldKeyword: string) => {
    const newKeywordSet = new Set<string>(keywords)
    newKeywordSet.delete(oldKeyword)
    setKeywords(newKeywordSet)
  }

  const onSubmit = (data: ListKeywordsFormValues) => {
    addKeyword(data.vaultListKeyword)
    formMethods.reset()
  }

  return (
    <FormProvider {...formMethods}>
      <div className={classNames('', className)}>
        <form onSubmit={formMethods.handleSubmit(onSubmit)} className='flex flex-col gap-2'>
          <SimpleInput
            formKey='vaultListKeyword'
            validate={{
              isNotFalsyString: (v) => !!v || 'Enter a valid keyword.'
            }}
            placeholder='Enter a keyword'
            label='Keywords (optional)'
          />
          <div className='flex flex-wrap gap-2'>
            {Array.from(keywords).map((keyword, i) => (
              <Keyword keyword={keyword} index={i} onDelete={deleteKeyword} />
            ))}
          </div>
        </form>
      </div>
    </FormProvider>
  )
}

interface KeywordProps {
  keyword: string
  index: number
  onDelete: (keyword: string) => void
}

const Keyword = (props: KeywordProps) => {
  const { keyword, index, onDelete } = props

  return (
    <span
      key={`${index}-${keyword.toLowerCase().replaceAll(' ', '_')}`}
      className='flex items-center gap-x-[.5ch] px-1 text-sm font-medium text-gray-600 bg-gray-400 rounded'
    >
      {keyword}
      <XMarkIcon className='h-3 w-3 cursor-pointer' onClick={() => onDelete(keyword)} />
    </span>
  )
}
