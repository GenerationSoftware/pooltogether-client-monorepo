import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { LinkIcon } from '@heroicons/react/24/outline'
import { Vault } from '@pooltogether/hyperstructure-client-js'
import { useVaults, useVaultTokenData } from '@pooltogether/hyperstructure-react-hooks'
import { SCREEN_SIZES, useScreenSize } from '@shared/generic-react-hooks'
import { TokenIcon } from '@shared/react-components'
import { BasicIcon, Spinner, Table, TableData, Tooltip } from '@shared/ui'
import { getNiceNetworkNameByChainId, getVaultId, shorten } from '@shared/utilities'
import classNames from 'classnames'
import { useAtom } from 'jotai'
import { vaultsAtom } from 'src/atoms'
import { MutableVaultInfo } from 'src/types'
import { isValidChars } from 'src/utils'
import { EditableText } from './EditableText'
import { VaultCard } from './VaultCard'

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

  const { width } = useScreenSize()
  const isMobile = !!width && width < SCREEN_SIZES.lg

  const tableData: TableData = {
    headers: {
      name: { content: 'Name', className: 'pl-9' },
      yieldSourceURI: { content: 'Yield URL', position: 'center' },
      network: { content: 'Network', position: 'center' },
      address: { content: 'Address', position: 'center' },
      tokenSymbol: { content: 'Token Symbol', position: 'center' },
      tokenAddress: { content: 'Token Address', position: 'center' },
      actions: { content: 'Actions', position: 'center' }
    },
    rows: vaultsArray.map((vault, i) => ({
      id: vault.id,
      cells: {
        name: {
          content: <VaultNameItem vault={vault} index={i} />
        },
        yieldSourceURI: {
          content: <VaultYieldSourceURIItem vault={vault} />,
          position: 'center'
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
        actions: {
          content: <VaultActionsItem vault={vault} onDelete={handleDeleteRow} />,
          position: 'center'
        }
      }
    }))
  }

  if (isMobile) {
    return (
      <div className={classNames('flex flex-col gap-2 items-center', className)}>
        {vaultsArray.map((vault) => (
          <VaultCard key={`vaultsCard-${vault.id}`} vault={vault} className='w-full max-w-xl' />
        ))}
      </div>
    )
  }

  return (
    <Table
      keyPrefix='vaultsTable'
      data={tableData}
      className={classNames('px-0 pb-0 bg-transparent', className)}
      innerClassName={classNames('overflow-y-auto', innerClassName)}
      headerClassName='px-0 pt-0 pb-6 text-center font-medium text-pt-purple-300 whitespace-nowrap'
      rowClassName='!p-0 text-sm font-medium bg-transparent'
      gridColsClassName={`grid-cols-[minmax(0,5fr)_minmax(0,2fr)_minmax(0,2fr)_minmax(0,3fr)_minmax(0,2fr)_minmax(0,3fr)_minmax(0,2fr)]`}
    />
  )
}

interface ItemProps {
  vault: Vault
}

const VaultNameItem = (props: ItemProps & { index: number }) => {
  const { vault, index } = props

  const { data: tokenData, isFetched: isFetchedTokenData } = useVaultTokenData(vault)

  const [vaultInfo, setVaultInfo] = useAtom(vaultsAtom)

  const handleVaultNameUpdate = (data: { text: string }) => {
    const newVaultInfo: MutableVaultInfo[] = [...vaultInfo]
    newVaultInfo[index].name = data.text.trim()
    setVaultInfo(newVaultInfo)
  }

  const isDisabled = isFetchedTokenData && !tokenData

  return (
    <div className='flex gap-3 grow items-center'>
      {!!tokenData ? (
        <TokenIcon token={tokenData} />
      ) : isFetchedTokenData ? (
        <BasicIcon content='?' />
      ) : (
        <WrappedSpinner />
      )}
      <EditableText
        value={vault.name}
        onSubmit={handleVaultNameUpdate}
        validate={{
          isNotFalsyString: (v: string) => !!v || 'Enter a valid vault name.',
          isValidString: (v: string) =>
            isValidChars(v, { allowSpaces: true }) || 'Invalid characters in vault name.'
        }}
        disabled={isDisabled}
        className='grow'
        textClassName={classNames('text-pt-purple-50 line-clamp-2', { 'line-through': isDisabled })}
      />
    </div>
  )
}

const VaultYieldSourceURIItem = (props: ItemProps) => {
  const { vault } = props

  return (
    <a href={vault.yieldSourceURI} target='_blank'>
      <LinkIcon className='h-5 w-5 text-pt-purple-100' />
    </a>
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

const VaultActionsItem = (props: ItemProps & { onDelete: (id: string) => void }) => {
  const { vault, onDelete } = props

  const { data: tokenData, isFetched: isFetchedTokenData } = useVaultTokenData(vault)

  const isErrored = isFetchedTokenData && !tokenData

  return (
    <div className='flex gap-2 items-center'>
      <span
        onClick={() => onDelete(vault.id)}
        className={classNames('text-xs text-pt-purple-300 cursor-pointer', { 'ml-7': isErrored })}
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
          <ExclamationTriangleIcon className='w-5 h-5 text-red-600' />
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
