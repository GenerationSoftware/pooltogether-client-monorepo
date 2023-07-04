import { Vault, Vaults } from '@pooltogether/hyperstructure-client-js'
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

// TODO: allow deleting vaults from table
export const VaultsTable = (props: VaultsTableProps) => {
  const { className } = props

  const vaultInfo = useAtomValue(vaultsAtom)
  const vaults = useVaults(vaultInfo, { useAllChains: true })
  const vaultsArray = Object.values(vaults.vaults)

  const tableData: TableData = {
    headers: {
      name: { content: 'Name' },
      network: { content: 'Network' },
      address: { content: 'Address' },
      tokenSymbol: { content: 'Token Symbol' },
      tokenAddress: { content: 'Token Address' }
    },
    rows: vaultsArray.map((vault) => ({
      id: vault.id,
      cells: {
        name: {
          content: <VaultNameItem vault={vault} />
        },
        network: { content: getNiceNetworkNameByChainId(vault.chainId) },
        address: { content: <span>{shorten(vault.address)}</span> },
        tokenSymbol: { content: <TokenSymbolItem vault={vault} /> },
        tokenAddress: { content: <TokenAddressItem vault={vault} /> }
      }
    }))
  }

  return <Table keyPrefix='vaultsTable' data={tableData} className={classNames('', className)} />
}

interface VaultNameItemProps {
  vault: Vault
}

const VaultNameItem = (props: VaultNameItemProps) => {
  const { vault } = props

  const { data: tokenData, isFetched: isFetchedTokenData } = useVaultTokenData(vault)

  return (
    <div className='flex items-center'>
      {isFetchedTokenData && !!tokenData ? <TokenIcon token={tokenData} /> : <Spinner />}
      <span>{vault.name}</span>
    </div>
  )
}

interface TokenSymbolItemProps {
  vault: Vault
}

const TokenSymbolItem = (props: TokenSymbolItemProps) => {
  const { vault } = props

  const { data: tokenData, isFetched: isFetchedTokenData } = useVaultTokenData(vault)

  if (!isFetchedTokenData || !tokenData) {
    return <Spinner />
  }

  return <span>{tokenData.symbol}</span>
}

interface TokenAddressItemProps {
  vault: Vault
}

const TokenAddressItem = (props: TokenAddressItemProps) => {
  const { vault } = props

  const { data: tokenData, isFetched: isFetchedTokenData } = useVaultTokenData(vault)

  if (!isFetchedTokenData || !tokenData) {
    return <Spinner />
  }

  return <span title={tokenData.address}>{shorten(tokenData.address)}</span>
}
