import { ExclamationTriangleIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Vault } from '@pooltogether/hyperstructure-client-js'
import { useVaults, useVaultTokenData } from '@pooltogether/hyperstructure-react-hooks'
import { TokenIcon } from '@shared/react-components'
import { BasicIcon, Spinner, Table, TableData, Tooltip } from '@shared/ui'
import { getNiceNetworkNameByChainId, getVaultId, shorten } from '@shared/utilities'
import classNames from 'classnames'
import { useAtom } from 'jotai'
import { vaultsAtom } from 'src/atoms'

interface VaultsTableProps {
  className?: string
  innerClassName?: string
}

export const VaultsTable = (props: VaultsTableProps) => {
  const { className, innerClassName } = props

  const [vaultInfo, setVaultInfo] = useAtom(vaultsAtom)
  const vaults = useVaults(vaultInfo, { useAllChains: true })
  const vaultsArray = Object.values(vaults.vaults)

  const handleDeleteRow = (vaultId: string) => {
    setVaultInfo(vaultInfo.filter((info) => vaultId !== getVaultId(info)))
  }

  const tableData: TableData = {
    headers: {
      name: { content: 'Name', className: 'pl-9' },
      network: { content: 'Network', position: 'center' },
      address: { content: 'Address', position: 'center' },
      tokenSymbol: { content: 'Token Symbol', position: 'center' },
      tokenAddress: { content: 'Token Address', position: 'center' },
      icons: { content: '' }
    },
    rows: vaultsArray.map((vault) => ({
      id: vault.id,
      cells: {
        name: {
          content: <VaultNameItem vault={vault} />
        },
        network: {
          content: <VaultNetworkItem vault={vault} />,
          position: 'center'
        },
        address: {
          content: <VaultAddressItem vault={vault} />,
          position: 'center'
        },
        tokenSymbol: {
          content: <TokenSymbolItem vault={vault} />,
          position: 'center'
        },
        tokenAddress: {
          content: <TokenAddressItem vault={vault} />,
          position: 'center'
        },
        icons: {
          content: <VaultIconsItem vault={vault} onDelete={handleDeleteRow} />
        }
      }
    }))
  }

  return (
    <Table
      keyPrefix='vaultsTable'
      data={tableData}
      className={classNames('px-0 pb-0 bg-transparent', className)}
      innerClassName={classNames('overflow-y-auto', innerClassName)}
      headerClassName='px-0 pt-0 pb-6 text-center font-medium text-pt-purple-300 whitespace-nowrap'
      rowClassName='!p-0 text-sm font-medium bg-transparent overflow-hidden'
      gridColsClassName={`grid-cols-[minmax(0,5fr)_minmax(0,2fr)_minmax(0,3fr)_minmax(0,2fr)_minmax(0,3fr)_minmax(0,1.2fr)]`}
    />
  )
}

interface ItemProps {
  vault: Vault
}

const VaultNameItem = (props: ItemProps) => {
  const { vault } = props

  const { data: tokenData, isFetched: isFetchedTokenData } = useVaultTokenData(vault)

  return (
    <div className='flex items-center gap-3'>
      {!!tokenData ? (
        <TokenIcon token={tokenData} />
      ) : isFetchedTokenData ? (
        <BasicIcon content='?' />
      ) : (
        <WrappedSpinner />
      )}
      <span
        className={classNames('line-clamp-2', { 'line-through': isFetchedTokenData && !tokenData })}
      >
        {vault.name}
      </span>
    </div>
  )
}

const VaultNetworkItem = (props: ItemProps) => {
  const { vault } = props

  const { data: tokenData, isFetched: isFetchedTokenData } = useVaultTokenData(vault)

  return (
    <span className={classNames({ 'line-through': isFetchedTokenData && !tokenData })}>
      {getNiceNetworkNameByChainId(vault.chainId)}
    </span>
  )
}

const VaultAddressItem = (props: ItemProps) => {
  const { vault } = props

  const { data: tokenData, isFetched: isFetchedTokenData } = useVaultTokenData(vault)

  return (
    <span className={classNames({ 'line-through': isFetchedTokenData && !tokenData })}>
      <AddressDisplay address={vault.address} />
    </span>
  )
}

const TokenSymbolItem = (props: ItemProps) => {
  const { vault } = props

  const { data: tokenData, isFetched: isFetchedTokenData } = useVaultTokenData(vault)

  if (!isFetchedTokenData) {
    return <WrappedSpinner />
  }

  if (!tokenData) {
    return <>-</>
  }

  return <span>{tokenData.symbol}</span>
}

const TokenAddressItem = (props: ItemProps) => {
  const { vault } = props

  const { data: tokenData, isFetched: isFetchedTokenData } = useVaultTokenData(vault)

  if (!isFetchedTokenData) {
    return <WrappedSpinner />
  }

  if (!tokenData) {
    return <>-</>
  }

  return <AddressDisplay address={tokenData.address} />
}

const VaultIconsItem = (props: ItemProps & { onDelete: (id: string) => void }) => {
  const { vault, onDelete } = props

  const { data: tokenData, isFetched: isFetchedTokenData } = useVaultTokenData(vault)

  return (
    <div className='flex gap-2'>
      <TrashIcon
        onClick={() => onDelete(vault.id)}
        className='w-5 h-5 text-pt-purple-50 cursor-pointer'
      />
      {isFetchedTokenData && !tokenData && (
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
          <ExclamationTriangleIcon className='w-5 h-5 text-pt-warning-light' />
        </Tooltip>
      )}
    </div>
  )
}

const AddressDisplay = (props: { address: string }) => {
  const { address } = props

  return <span title={address}>{shorten(address)}</span>
}

// NOTE: This is wrapped to avoid table overflow on spinner animation
const WrappedSpinner = () => {
  return (
    <div className='h-5 w-5 relative'>
      <Spinner className='absolute' />
    </div>
  )
}
