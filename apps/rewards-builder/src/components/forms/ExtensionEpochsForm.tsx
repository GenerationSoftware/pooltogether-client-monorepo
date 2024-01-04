import { TokenAmount } from '@shared/react-components'
import { PromotionInfo } from '@shared/types'
import classNames from 'classnames'
import { FormProvider, useForm } from 'react-hook-form'
import { SimpleInput } from './SimpleInput'

interface ExtensionEpochsFormValues {
  numExtensionEpochs: string
}

interface ExtensionEpochsFormProps {
  chainId: number
  promotionId: number
  promotionInfo: PromotionInfo
  className?: string
}

export const ExtensionEpochsForm = (props: ExtensionEpochsFormProps) => {
  const { chainId, promotionId, promotionInfo, className } = props

  const formMethods = useForm<ExtensionEpochsFormValues>({ mode: 'onChange' })

  const { numExtensionEpochs } = formMethods.watch()

  const maxNumExtensionEpochs = 255 - promotionInfo.numberOfEpochs

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit(() => {})}
        className={classNames('flex flex-col grow gap-8 items-center justify-center', className)}
      >
        <SimpleInput
          formKey='numExtensionEpochs'
          validate={{
            isValidNumber: (v: string) => /^-?\d+\.?\d*$/.test(v) || 'Enter a valid number.',
            isValidInteger: (v: string) => v.split('.').length < 2 || 'No decimals allowed.',
            isValidNumEpochs: (v: string) =>
              (parseInt(v) >= 1 && parseInt(v) <= maxNumExtensionEpochs) ||
              `Enter a number between 1 and ${maxNumExtensionEpochs}.`
          }}
          placeholder={`1-${maxNumExtensionEpochs}`}
          label='How many reward epochs to extend by?'
          className='w-full max-w-md'
        />
        <div className='flex gap-2 text-lg'>
          <span className='font-semibold text-pt-purple-200'>Tokens Required:</span>
          <TokenAmount
            token={{
              chainId,
              address: promotionInfo.token,
              amount: promotionInfo.tokensPerEpoch * BigInt(numExtensionEpochs)
            }}
          />
        </div>
        {/* TODO: add ExtendPromotionButton */}
      </form>
    </FormProvider>
  )
}
