import { TrashIcon } from '@heroicons/react/24/outline'
import { useCustomRPCs } from '@shared/generic-react-hooks'
import { Intl } from '@shared/types'
import { Button, Spinner } from '@shared/ui'
import { getNiceNetworkNameByChainId, NETWORK } from '@shared/utilities'
import classNames from 'classnames'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { createPublicClient, http } from 'viem'
import { SimpleInput } from '../../../Form/SimpleInput'

// TODO: intl
interface RPCsViewProps {
  chainIds: NETWORK[]
}

// TODO: empty state for when chainIds is an empty array
export const RPCsView = (props: RPCsViewProps) => {
  const { chainIds } = props

  return (
    <div className='flex flex-col gap-4 md:gap-8'>
      <Header />

      <div className='flex flex-col gap-2'>
        {chainIds.map((chainId) => (
          <CustomRPCInput key={`customRPC-${chainId}`} chainId={chainId} />
        ))}
      </div>

      {/* TODO: add button to prompt for app refesh (if necessary) */}
    </div>
  )
}

// TODO: intl
interface HeaderProps {}

const Header = (props: HeaderProps) => {
  const {} = props

  return (
    <div className='flex flex-col items-center gap-2 text-center'>
      <span className='text-lg font-semibold md:text-xl'>Set Custom RPCs</span>
      <span className='text-sm text-pt-purple-50 md:text-base'>
        Cabana's default RPCs will be used if custom RPCs aren't provided for any network.
      </span>
    </div>
  )
}

// TODO: intl
interface CustomRPCInputProps {
  chainId: NETWORK
  className?: string
}

const CustomRPCInput = (props: CustomRPCInputProps) => {
  const { chainId, className } = props

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
        } else {
          formMethods.setError('rpc', {
            message: `This RPC doesn't seem to be for the ${networkName} network`
          })
        }
      } else {
        remove(chainId)
        formMethods.clearErrors('rpc')
      }
    } catch (err) {
      formMethods.setError('rpc', {
        message: 'Not a valid RPC URL'
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
        className={classNames('inline-flex flex-col gap-x-4 gap-y-2 sm:flex-row', className)}
      >
        {/* TODO: use intl for `overrideLabel` */}
        <SimpleInput
          formKey='rpc'
          needsOverride={true}
          keepValueOnOverride={true}
          label={`Custom ${networkName} RPC`}
          validate={{
            isValidURL: (v) =>
              !v || v.startsWith('http://') || v.startsWith('https://') || 'Not a valid RPC URL'
          }}
          placeholder='https://...'
          className='w-full'
          innerClassName={classNames({ 'brightness-75': isCheckingRPC })}
        />
        <Button
          type='submit'
          color='purple'
          className='relative bg-pt-purple-600 border-pt-purple-600 hover:bg-pt-purple-500 focus:outline-transparent'
          disabled={
            isCheckingRPC ||
            !formMethods.formState.isValid ||
            formMethods.formState.isValidating ||
            checkedRpcUrl === formRpcUrl?.trim()
          }
        >
          <span
            className={classNames('py-[1px] text-pt-purple-50 whitespace-nowrap', {
              'opacity-0': !!formRpcUrl && (isCheckingRPC || checkedRpcUrl === formRpcUrl.trim())
            })}
          >
            Check
          </span>
          {/* TODO: use check and X images */}
          {!!formRpcUrl &&
            !isCheckingRPC &&
            checkedRpcUrl === formRpcUrl.trim() &&
            (formMethods.formState.isValid ? <>YES</> : <>NO</>)}
          {isCheckingRPC && <Spinner className='absolute left-0 right-0 mx-auto' />}
        </Button>
        <TrashIcon
          onClick={() => {
            remove(chainId)
            formMethods.setValue('rpc', '')
            setCheckedRpcUrl('')
          }}
          className='h-5 w-5 text-pt-purple-200 cursor-pointer'
        />
      </form>
    </FormProvider>
  )
}
