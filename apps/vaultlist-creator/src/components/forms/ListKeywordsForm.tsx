import classNames from 'classnames'
import { useAtom } from 'jotai'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import { listKeywordsAtom } from 'src/atoms'

interface ListKeywordsFormValues {
  keyword: string
}

interface ListKeywordsFormProps {
  className?: string
}

// TODO: better string validation
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
    addKeyword(data.keyword)
  }

  return (
    <FormProvider {...formMethods}>
      <div className={classNames('', className)}>
        <form onSubmit={formMethods.handleSubmit(onSubmit)}>
          <Input formKey='keyword' />
          <div className='flex gap-2'>
            {Array.from(keywords).map((keyword, i) => (
              // TODO: enable deleting keywords
              <span key={`${i}-${keyword.toLowerCase().replaceAll(' ', '_')}`} className=''>
                {keyword}
              </span>
            ))}
          </div>
        </form>
      </div>
    </FormProvider>
  )
}

interface InputProps {
  formKey: keyof ListKeywordsFormValues
  validate?: { [rule: string]: (v: any) => true | string }
}

const Input = (props: InputProps) => {
  const { formKey, validate } = props

  const { register } = useFormContext<ListKeywordsFormValues>()

  const basicValidation: { [rule: string]: (v: any) => true | string } = {
    isNotFalsyString: (v) => !!v || 'Enter a valid keyword.'
  }

  return (
    <input
      id={formKey}
      {...register(formKey, {
        validate: { ...basicValidation, ...validate }
      })}
      placeholder='...'
      className='text-gray-700'
    />
  )
}
