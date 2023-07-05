import { Vault } from '@pooltogether/hyperstructure-client-js'
import { useVaults, useVaultTokenData } from '@pooltogether/hyperstructure-react-hooks'
import { TokenIcon } from '@shared/react-components'
import { Spinner, Table, TableData } from '@shared/ui'
import { getNiceNetworkNameByChainId, shorten } from '@shared/utilities'
import classNames from 'classnames'
import { useAtomValue } from 'jotai'
import { vaultsAtom } from 'src/atoms'

interface VaultsTableProps {
  className?: string
}

export const VaultsTable = (props: VaultsTableProps) => {
  const { className } = props

  const vaultInfo = useAtomValue(vaultsAtom)
  const vaults = useVaults(vaultInfo, { useAllChains: true })
  const vaultsArray = Object.values(vaults.vaults)

  const tableData: TableData = {
    headers: {
      name: { content: 'Name', className: 'pl-9' },
      network: { content: 'Network', position: 'center' },
      address: { content: 'Address', position: 'center' },
      tokenSymbol: { content: 'Token Symbol', position: 'center' },
      tokenAddress: { content: 'Token Address', position: 'center' }
    },
    rows: vaultsArray.map((vault) => ({
      id: vault.id,
      cells: {
        name: {
          content: <VaultNameItem vault={vault} />
        },
        network: {
          content: getNiceNetworkNameByChainId(vault.chainId),
          position: 'center'
        },
        address: {
          content: <AddressDisplay address={vault.address} />,
          position: 'center'
        },
        tokenSymbol: {
          content: <TokenSymbolItem vault={vault} />,
          position: 'center'
        },
        tokenAddress: {
          content: <TokenAddressItem vault={vault} />,
          position: 'center'
        }
      }
    }))
  }

  return (
    <Table
      keyPrefix='vaultsTable'
      data={tableData}
      className={classNames('px-0 pb-0 bg-transparent', className)}
      headerClassName='px-0 pt-0 pb-6 text-center font-medium text-pt-purple-300'
      rowClassName='px-0 pt-0 pb-0 text-sm font-medium bg-transparent'
      gridColsClassName={`grid-cols-[minmax(0,5fr)_minmax(0,2fr)_minmax(0,3fr)_minmax(0,2fr)_minmax(0,3fr)]`}
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
      {isFetchedTokenData && !!tokenData ? <TokenIcon token={tokenData} /> : <Spinner />}
      <span className='line-clamp-2'>{vault.name}</span>
    </div>
  )
}

const TokenSymbolItem = (props: ItemProps) => {
  const { vault } = props

  const { data: tokenData, isFetched: isFetchedTokenData } = useVaultTokenData(vault)

  if (!isFetchedTokenData || !tokenData) {
    return <Spinner />
  }

  return <span>{tokenData.symbol}</span>
}

const TokenAddressItem = (props: ItemProps) => {
  const { vault } = props

  const { data: tokenData, isFetched: isFetchedTokenData } = useVaultTokenData(vault)

  if (!isFetchedTokenData || !tokenData) {
    return <Spinner />
  }

  return <AddressDisplay address={tokenData.address} />
}

const AddressDisplay = (props: { address: string }) => {
  const { address } = props

  return <span title={address}>{shorten(address)}</span>
}
