import { ArrowPathRoundedSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useCustomRPCs } from '@shared/generic-react-hooks'
import { Intl } from '@shared/types'
import { Button, Spinner } from '@shared/ui'
import { getNiceNetworkNameByChainId, NETWORK } from '@shared/utilities'
import classNames from 'classnames'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { createPublicClient, http } from 'viem'
import { SimpleInput } from '../../../Form/SimpleInput'

interface RPCsViewProps {
  chainIds: NETWORK[]
  onClickPageReload: () => void
  intl?: {
    base?: Intl<
      | 'setCustomRPCs'
      | 'customRpcDescription'
      | 'customNetworkRpc'
      | 'override'
      | 'default'
      | 'set'
      | 'refreshToUpdateRPCs'
    >
    errors?: Intl<'formErrors.invalidRpcNetwork' | 'formErrors.invalidRpcUrl'>
  }
}

export const RPCsView = (props: RPCsViewProps) => {
  const { chainIds, onClickPageReload, intl } = props

  const [isChangesMade, setIsChangesMade] = useState<boolean>(false)

  return (
    <div className='flex flex-col gap-4 md:gap-8'>
      <Header intl={intl?.base} />

      <div className='flex flex-col gap-2'>
        {chainIds.map((chainId) => (
          <CustomRPCInput
            key={`customRPC-${chainId}`}
            chainId={chainId}
            onUpdate={() => setIsChangesMade(true)}
            intl={intl}
          />
        ))}
      </div>

      {isChangesMade && (
        <span
          onClick={onClickPageReload}
          className='inline-flex gap-2 items-center justify-center text-center text-sm text-pt-purple-200 cursor-pointer'
        >
          <ArrowPathRoundedSquareIcon className='h-6 w-6' />
          <span>{intl?.base?.('refreshToUpdateRPCs') ?? 'Refresh the page to see changes'}</span>
        </span>
      )}
    </div>
  )
}

interface HeaderProps {
  intl?: Intl<'setCustomRPCs' | 'customRpcDescription'>
}

const Header = (props: HeaderProps) => {
  const { intl } = props

  return (
    <div className='flex flex-col items-center gap-2 text-center'>
      <span className='text-lg font-semibold md:text-xl'>
        {intl?.('setCustomRPCs') ?? 'Set Custom RPCs'}
      </span>
      <span className='text-sm text-pt-purple-50 md:text-base'>
        {intl?.('customRpcDescription') ??
          `Route the app's onchain queries through RPCs of your choosing. These are stored locally on your browser.`}
      </span>
    </div>
  )
}

interface CustomRPCInputProps {
  chainId: NETWORK
  onUpdate?: (rpcUrl: string) => void
  className?: string
  intl?: {
    base?: Intl<'customNetworkRpc' | 'override' | 'default' | 'set'>
    errors?: Intl<'formErrors.invalidRpcNetwork' | 'formErrors.invalidRpcUrl'>
  }
}

const CustomRPCInput = (props: CustomRPCInputProps) => {
  const { chainId, onUpdate, className, intl } = props

  const { customRPCs, set, remove } = useCustomRPCs()

  const formMethods = useForm<{ rpc: string }>({
    mode: 'onChange',
    defaultValues: { rpc: customRPCs[chainId] ?? '' }
  })

  const { rpc: formRpcUrl } = formMethods.watch()

  const [checkedRpcUrl, setCheckedRpcUrl] = useState<string>(customRPCs[chainId] ?? '')
  const [isCheckingRPC, setIsCheckingRPC] = useState<boolean>(false)

  const networkName = getNiceNetworkNameByChainId(chainId)

  const onSubmit = async (data: { rpc: string }) => {
    setIsCheckingRPC(true)
    formMethods.clearErrors('rpc')

    const cleanRpcUrl = data.rpc?.trim()

    try {
      if (!!cleanRpcUrl) {
        const publicClient = createPublicClient({ transport: http(cleanRpcUrl) })
        const rpcChainId = await publicClient.getChainId()

        if (rpcChainId === chainId) {
          set(chainId, cleanRpcUrl)
          formMethods.clearErrors('rpc')
          onUpdate?.(cleanRpcUrl)
        } else {
          formMethods.setError('rpc', {
            message:
              intl?.errors?.('formErrors.invalidRpcNetwork', { network: networkName }) ??
              `This RPC doesn't seem to be for the ${networkName} network`
          })
        }
      } else {
        remove(chainId)
        formMethods.clearErrors('rpc')
        onUpdate?.('')
      }
    } catch (err) {
      formMethods.setError('rpc', {
        message: intl?.errors?.('formErrors.invalidRpcUrl') ?? 'Not a valid RPC URL'
      })
    } finally {
      setCheckedRpcUrl(cleanRpcUrl ?? '')
      setIsCheckingRPC(false)
    }
  }

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit(onSubmit)}
        className={classNames('inline-flex flex-col gap-2 sm:flex-row', className)}
      >
        <SimpleInput
          formKey='rpc'
          needsOverride={true}
          keepValueOnOverride={true}
          label={
            intl?.base?.('customNetworkRpc', { network: networkName }) ??
            `Custom ${networkName} RPC`
          }
          overrideLabel={intl?.base?.('override') ?? 'override'}
          validate={{
            isValidURL: (v) =>
              !v ||
              v.startsWith('http://') ||
              v.startsWith('https://') ||
              (intl?.errors?.('formErrors.invalidRpcUrl') ?? 'Not a valid RPC URL')
          }}
          placeholder='https://...'
          className='w-full'
          innerClassName={classNames({ 'brightness-75': isCheckingRPC })}
        />
        <div
          className={classNames('flex gap-2 items-center sm:mt-5', {
            'sm:!mt-1': !formMethods.formState.isValid
          })}
        >
          <SetCustomRpcButton
            formRpcUrl={formRpcUrl}
            checkedRpcUrl={checkedRpcUrl}
            isCheckingRPC={isCheckingRPC}
            isFormValid={formMethods.formState.isValid && !formMethods.formState.isValidating}
            className='flex-grow'
            intl={intl?.base}
          />
          <TrashIcon
            onClick={
              !!customRPCs[chainId]
                ? () => {
                    remove(chainId)
                    formMethods.setValue('rpc', '')
                    setCheckedRpcUrl('')
                    onUpdate?.('')
                  }
                : undefined
            }
            className={classNames('h-6 w-auto text-pt-purple-200', {
              'cursor-pointer': !!customRPCs[chainId],
              'opacity-50': !customRPCs[chainId]
            })}
          />
        </div>
      </form>
    </FormProvider>
  )
}

interface SetCustomRpcButtonProps {
  formRpcUrl: string | undefined
  checkedRpcUrl: string
  isCheckingRPC: boolean
  isFormValid: boolean
  className?: string
  intl?: Intl<'default' | 'set'>
}

const SetCustomRpcButton = (props: SetCustomRpcButtonProps) => {
  const { formRpcUrl, checkedRpcUrl, isCheckingRPC, isFormValid, className, intl } = props

  const isFormRpcUrlChecked = !isCheckingRPC && checkedRpcUrl === formRpcUrl?.trim()
  const isDefaultRpcUrl = !formRpcUrl && !checkedRpcUrl

  const isButtonDisabled = isCheckingRPC || isFormRpcUrlChecked || !isFormValid || isDefaultRpcUrl
  const isButtonTextHidden = !!formRpcUrl && (isCheckingRPC || isFormRpcUrlChecked)

  const isSubmitted = !!formRpcUrl && isFormRpcUrlChecked

  const iconClassName = 'absolute inset-x-0 max-h-12 mx-auto text-pt-purple-50 opacity-0'

  return (
    <Button
      type='submit'
      color='purple'
      className={classNames(
        'relative bg-pt-purple-600 border-pt-purple-600 hover:bg-pt-purple-500 focus:outline-transparent',
        className
      )}
      disabled={isButtonDisabled}
    >
      <div className='py-[1px] text-pt-purple-50'>
        <span className={classNames({ 'opacity-0': isButtonTextHidden || !isDefaultRpcUrl })}>
          {intl?.('default') ?? 'Default'}
        </span>
        {!isButtonTextHidden && !isDefaultRpcUrl && (
          <span className='absolute inset-x-0'>{intl?.('set') ?? 'Set'}</span>
        )}
      </div>
      <CheckIcon
        className={classNames(iconClassName, { 'opacity-100': isSubmitted && isFormValid })}
      />
      <XIcon
        className={classNames(iconClassName, { 'opacity-100': isSubmitted && !isFormValid })}
      />
      {isCheckingRPC && <Spinner className='absolute left-0 right-0 mx-auto' />}
    </Button>
  )
}

const CheckIcon = (props: { className?: string }) => (
  <svg
    fill='none'
    stroke='currentColor'
    strokeWidth={1.5}
    viewBox='0 0 24 24'
    xmlns='http://www.w3.org/2000/svg'
    aria-hidden='true'
    className={props.className}
  >
    <path strokeLinecap='round' strokeLinejoin='round' d='M 9 12.75 L 11.25 15 15 9.75' />
  </svg>
)

const XIcon = (props: { className?: string }) => (
  <svg
    fill='none'
    stroke='currentColor'
    strokeWidth={1.5}
    viewBox='0 0 24 24'
    xmlns='http://www.w3.org/2000/svg'
    aria-hidden='true'
    className={props.className}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M 9.75 9.75 l 4.5 4.5 m 0 -4.5 l -4.5 4.5'
    />
  </svg>
)
