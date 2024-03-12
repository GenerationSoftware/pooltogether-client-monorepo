import { useToken } from '@generationsoftware/hyperstructure-react-hooks'
import { TokenIcon } from '@shared/react-components'
import { Card, ExternalLink, Spinner } from '@shared/ui'
import { getBlockExplorerUrl, shorten } from '@shared/utilities'
import classNames from 'classnames'
import { useAtomValue } from 'jotai'
import { useFormContext, useWatch } from 'react-hook-form'
import { vaultChainIdAtom } from 'src/atoms'
import { SupportedNetwork, YieldSourceVaultTag } from 'src/types'
import { Address } from 'viem'
import { NETWORK_CONFIG, VAULT_TAGS } from '@constants/config'
import { useYieldSourceTokenAddress } from '@hooks/useYieldSourceTokenAddress'

interface YieldVaultInputFormValues {
  vaultYieldSourceAddress: string
}

interface YieldVaultInputProps {
  yieldVault: (typeof NETWORK_CONFIG)[SupportedNetwork]['yieldSources'][number]['vaults'][number]
  className?: string
}

export const YieldVaultInput = (props: YieldVaultInputProps) => {
  const { yieldVault, className } = props

  const chainId = useAtomValue(vaultChainIdAtom)

  const { register } = useFormContext<YieldVaultInputFormValues>()

  if (!chainId) {
    return <Spinner />
  }

  const id = `yieldVault-${yieldVault.address}`

  return (
    <div className={classNames('max-w-sm lg:max-w-[25%]', className)}>
      <input
        id={id}
        {...register('vaultYieldSourceAddress', {
          validate: { isSelected: (v: string) => !!v || 'Select a deposit token!' }
        })}
        type='radio'
        value={yieldVault.address}
        className='hidden'
      />
      <label htmlFor={id}>
        <YieldVaultCard chainId={chainId} yieldVault={yieldVault} />
      </label>
    </div>
  )
}

interface YieldVaultCardProps {
  chainId: SupportedNetwork
  yieldVault: (typeof NETWORK_CONFIG)[SupportedNetwork]['yieldSources'][number]['vaults'][number]
}

// TODO: add existing vaults # notice
const YieldVaultCard = (props: YieldVaultCardProps) => {
  const { chainId, yieldVault } = props

  const { data: tokenAddress } = useYieldSourceTokenAddress(chainId, yieldVault.address)
  const { data: token } = useToken(chainId, tokenAddress as Address)

  const { vaultYieldSourceAddress } = useWatch<YieldVaultInputFormValues>()

  const isSelected =
    !!vaultYieldSourceAddress &&
    vaultYieldSourceAddress.toLowerCase() === yieldVault.address.toLowerCase()

  return (
    <Card
      wrapperClassName={classNames(
        'w-full h-full border cursor-pointer overflow-hidden hover:bg-pt-purple-50/20',
        { 'border-pt-teal-dark': isSelected, 'border-transparent': !isSelected }
      )}
      className='gap-3 !justify-start !p-6'
    >
      <div className='flex items-center gap-1'>
        {!!token ? (
          <>
            <TokenIcon token={token} />
            <span className='text-lg font-bold text-pt-purple-100'>{token.symbol}</span>
          </>
        ) : (
          <Spinner />
        )}
      </div>
      <ExternalLink
        href={getBlockExplorerUrl(chainId, yieldVault.address)}
        size='xs'
        className='text-blue-500'
      >
        {shorten(yieldVault.address)}
      </ExternalLink>
      <YieldVaultCardTags tags={yieldVault.tags} className='mt-auto' />
    </Card>
  )
}

interface YieldVaultCardTagsProps {
  tags?: YieldSourceVaultTag[]
  className?: string
}

const YieldVaultCardTags = (props: YieldVaultCardTagsProps) => {
  const { tags, className } = props

  if (!tags?.length) {
    return <></>
  }

  return (
    <div className={classNames('flex flex-wrap gap-x-3 gap-y-2', className)}>
      {tags.map((tag) => (
        <span
          key={tag}
          className='px-1.5 py-1 text-xs text-pt-purple-700 bg-pt-purple-100 whitespace-nowrap rounded'
        >
          {VAULT_TAGS[tag]}
        </span>
      ))}
    </div>
  )
}
