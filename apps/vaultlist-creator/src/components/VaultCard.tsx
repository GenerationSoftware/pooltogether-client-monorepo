import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { Vault } from '@pooltogether/hyperstructure-client-js'
import { useVaultTokenData } from '@pooltogether/hyperstructure-react-hooks'
import { TokenIcon } from '@shared/react-components'
import { BasicIcon, Spinner, Tooltip } from '@shared/ui'
import { getNiceNetworkNameByChainId, getVaultId, shorten } from '@shared/utilities'
import classNames from 'classnames'
import { useAtom } from 'jotai'
import { vaultsAtom } from 'src/atoms'

interface VaultCardProps {
  vault: Vault
  className?: string
}

// TODO: show yield source URI
export const VaultCard = (props: VaultCardProps) => {
  const { vault, className } = props

  const [vaultInfo, setVaultInfo] = useAtom(vaultsAtom)

  const handleDeleteRow = (vaultId: string) => {
    setVaultInfo(vaultInfo.filter((info) => vaultId !== getVaultId(info)))
  }

  return (
    <div
      className={classNames(
        'flex flex-col gap-1 items-center px-8 py-6 bg-pt-transparent rounded',
        className
      )}
    >
      <VaultNameItem vault={vault} className='mb-3' />
      <VaultNetworkItem vault={vault} />
      <VaultAddressItem vault={vault} />
      <TokenSymbolItem vault={vault} />
      <TokenAddressItem vault={vault} />
      <VaultActionsItem vault={vault} onDelete={handleDeleteRow} className='mt-3' />
    </div>
  )
}

interface ItemProps {
  vault: Vault
  className?: string
}

const VaultNameItem = (props: ItemProps) => {
  const { vault, className } = props

  const { data: tokenData, isFetched: isFetchedTokenData } = useVaultTokenData(vault)

  return (
    <div className={classNames('flex gap-3 items-center', className)}>
      {!!tokenData ? (
        <TokenIcon token={tokenData} />
      ) : isFetchedTokenData ? (
        <BasicIcon content='?' />
      ) : (
        <Spinner />
      )}
      <div className='px-2 py-1 text-sm font-medium bg-pt-purple-50/[.15] rounded'>
        {vault.name}
      </div>
    </div>
  )
}

const VaultNetworkItem = (props: ItemProps) => {
  const { vault, className } = props

  const { data: tokenData, isFetched: isFetchedTokenData } = useVaultTokenData(vault)

  return (
    <div className={classNames('w-full flex justify-between text-sm font-medium', className)}>
      <span>Network</span>
      <span className={classNames({ 'line-through': isFetchedTokenData && !tokenData })}>
        {getNiceNetworkNameByChainId(vault.chainId)}
      </span>
    </div>
  )
}

const VaultAddressItem = (props: ItemProps) => {
  const { vault, className } = props

  const { data: tokenData, isFetched: isFetchedTokenData } = useVaultTokenData(vault)

  return (
    <div className={classNames('w-full flex justify-between text-sm font-medium', className)}>
      <span>Vault Address</span>
      <span className={classNames({ 'line-through': isFetchedTokenData && !tokenData }, className)}>
        <AddressDisplay address={vault.address} />
      </span>
    </div>
  )
}

const TokenSymbolItem = (props: ItemProps) => {
  const { vault, className } = props

  const { data: tokenData, isFetched: isFetchedTokenData } = useVaultTokenData(vault)

  return (
    <div className={classNames('w-full flex justify-between text-sm font-medium', className)}>
      <span>Token Symbol</span>
      <span>{isFetchedTokenData ? !!tokenData ? tokenData.symbol : '-' : <Spinner />}</span>
    </div>
  )
}

const TokenAddressItem = (props: ItemProps) => {
  const { vault, className } = props

  const { data: tokenData, isFetched: isFetchedTokenData } = useVaultTokenData(vault)

  return (
    <div className={classNames('w-full flex justify-between text-sm font-medium', className)}>
      <span>Token Address</span>
      <span>
        {isFetchedTokenData ? (
          !!tokenData ? (
            <AddressDisplay address={tokenData.address} />
          ) : (
            '-'
          )
        ) : (
          <Spinner />
        )}
      </span>
    </div>
  )
}

const VaultActionsItem = (props: ItemProps & { onDelete: (id: string) => void }) => {
  const { vault, onDelete, className } = props

  const { data: tokenData, isFetched: isFetchedTokenData } = useVaultTokenData(vault)

  const isErrored = isFetchedTokenData && !tokenData

  return (
    <div className={classNames('flex gap-2 items-center', className)}>
      <span
        onClick={() => onDelete(vault.id)}
        className='text-xs text-pt-purple-300 cursor-pointer'
      >
        delete
      </span>
      {isErrored && (
        <Tooltip
          content={
            <div className='w-[16ch] text-center'>
              <span>
                We were not able to query information about this vault. It will not be included in
                the vault list.
              </span>
            </div>
          }
        >
          <ExclamationTriangleIcon className='w-4 h-4 text-red-600' />
        </Tooltip>
      )}
    </div>
  )
}

const AddressDisplay = (props: { address: string }) => {
  const { address } = props

  return <span title={address}>{shorten(address)}</span>
}
