import { XMarkIcon } from '@heroicons/react/24/solid'
import { useAtom } from 'jotai'
import { FormProvider, useForm } from 'react-hook-form'
import { listKeywordsAtom } from 'src/atoms'
import { isValidChars } from 'src/utils'
import { SimpleInput } from './SimpleInput'

interface ListKeywordsFormValues {
  vaultListKeyword: string
}

interface ListKeywordsFormProps {
  className?: string
}

export const ListKeywordsForm = (props: ListKeywordsFormProps) => {
  const { className } = props

  const formMethods = useForm<ListKeywordsFormValues>({ mode: 'onChange' })

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
    if (!!data.vaultListKeyword) {
      addKeyword(data.vaultListKeyword.toLowerCase().trim())
    }
    formMethods.reset()
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === ' ') {
      e.preventDefault()
      formMethods.handleSubmit(onSubmit)()
    }
  }

  return (
    <FormProvider {...formMethods}>
      <div className={className}>
        <form
          onSubmit={formMethods.handleSubmit(onSubmit)}
          onBlur={formMethods.handleSubmit(onSubmit)}
          onKeyDown={onKeyDown}
          className='flex flex-col gap-2'
        >
          <SimpleInput
            formKey='vaultListKeyword'
            validate={{
              isNotTooLong: (v: string) => !v || v.length <= 32 || 'Keyword too long!',
              isValidString: (v: string) =>
                !v || isValidChars(v) || 'Invalid characters in keyword.'
            }}
            placeholder='Enter a keyword'
            label='Keywords (optional)'
          />
          <div className='flex flex-wrap gap-2'>
            {Array.from(keywords).map((keyword, i) => (
              <Keyword key={`${i}-${keyword}`} keyword={keyword} onDelete={deleteKeyword} />
            ))}
          </div>
        </form>
      </div>
    </FormProvider>
  )
}

interface KeywordProps {
  keyword: string
  onDelete: (keyword: string) => void
}

const Keyword = (props: KeywordProps) => {
  const { keyword, onDelete } = props

  return (
    <span className='flex items-center gap-x-[.5ch] px-1 text-sm font-medium text-gray-700 bg-gray-300 rounded'>
      {keyword}
      <XMarkIcon className='h-3 w-3 cursor-pointer' onClick={() => onDelete(keyword)} />
    </span>
  )
}
