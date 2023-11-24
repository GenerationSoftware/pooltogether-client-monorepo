import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { usePublicClientsByChain } from '@generationsoftware/hyperstructure-react-hooks'
import { useScreenSize } from '@shared/generic-react-hooks'
import { VaultBadge } from '@shared/react-components'
import { LINKS, Spinner, Table, TableData } from '@shared/ui'
import { getBlockExplorerUrl, shorten } from '@shared/utilities'
import classNames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { Promotion } from 'src/types'
import { Address, zeroAddress } from 'viem'
import { useAccount } from 'wagmi'
import { SUPPORTED_NETWORKS } from '@constants/config'
import { useAllPromotions } from '@hooks/useAllPromotions'
import { DeployedPromotionCard } from './DeployedPromotionCard'

interface DeployedPromotionsTableProps {
  className?: string
}

export const DeployedPromotionsTable = (props: DeployedPromotionsTableProps) => {
  const { className } = props

  const publicClients = usePublicClientsByChain({ useAll: true })

  const { data: allPromotions } = useAllPromotions()

  const promotionsArray = useMemo(() => {
    const array: Promotion[] = []

    SUPPORTED_NETWORKS.forEach((chainId) => {
      if (!!allPromotions[chainId]) {
        Object.entries(allPromotions[chainId]).forEach(([id, info]) => {
          const vault = new Vault(chainId, info.vault, publicClients[chainId])
          array.push({ chainId, id: parseInt(id), ...info, vault })
        })
      }
    })

    // TODO: sort these somehow?
    return array
  }, [allPromotions])

  const { width: screenWidth } = useScreenSize()
  const isMobile = !!screenWidth && screenWidth < 1024

  const tableData: TableData = {
    headers: {
      vault: { content: 'Vault', className: 'pl-11' },
      owner: { content: 'Owner', position: 'center' },
      status: { content: 'Status', position: 'center' },
      actions: { content: 'Actions', position: 'center' }
    },
    rows: promotionsArray.map((promotion) => ({
      id: `${promotion.chainId}-${promotion.id}`,
      cells: {
        vault: {
          content: <VaultItem vault={promotion.vault} />
        },
        owner: {
          content: (
            <AddressItem chainId={promotion.chainId} address={promotion.creator ?? zeroAddress} />
          ),
          position: 'center'
        },
        status: {
          content: <StatusItem />,
          position: 'center'
        },
        actions: {
          content: <ActionsItem />,
          position: 'center'
        }
      }
    }))
  }

  if (tableData.rows.length === 0) {
    return <></>
  }

  if (isMobile) {
    return (
      <div className='w-full flex flex-col gap-4 items-center'>
        {promotionsArray.map((promotion) => (
          <DeployedPromotionCard
            key={`deployedPromotion-${promotion.chainId}-${promotion.id}`}
            promotion={promotion}
          />
        ))}
      </div>
    )
  }

  return (
    <Table
      keyPrefix='deployedPromotionsTable'
      data={tableData}
      className={classNames('px-6 pb-6 bg-pt-transparent/20 rounded-3xl', className)}
      innerClassName='overflow-y-auto'
      headerClassName='text-center font-medium text-pt-purple-300 whitespace-nowrap'
      rowClassName='text-sm font-medium rounded-lg overflow-hidden'
      gridColsClassName={`grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]`}
    />
  )
}

const VaultItem = (props: { vault: Vault }) => {
  const { vault } = props

  return (
    <Link href={`${LINKS.app}/vault/${vault.chainId}/${vault.address}`} target='_blank'>
      <VaultBadge vault={vault} onClick={() => {}} symbolClassName='hidden' />
    </Link>
  )
}

const AddressItem = (props: { chainId: number; address: Address }) => {
  const { chainId, address } = props

  if (address === zeroAddress) {
    return <>?</>
  }

  return (
    <a href={getBlockExplorerUrl(chainId, address)} target='_blank'>
      {shorten(address)}
    </a>
  )
}

const StatusItem = (props: {}) => {
  const {} = props

  // TODO

  // if (vaultState === 'invalid') {
  //   return <span className='text-sm text-pt-warning-light'>invalid</span>
  // }

  // if (vaultState === 'missingLiquidationPair' || vaultState === 'missingClaimer') {
  //   return <span className='text-sm text-pt-warning-light'>incomplete</span>
  // }

  // if (vaultState === 'active') {
  //   return <span className='text-sm text-pt-purple-300'>active</span>
  // }

  return <WrappedSpinner />
}

const ActionsItem = (props: {}) => {
  const {} = props

  const router = useRouter()

  const { address } = useAccount()

  // TODO

  // const { data: vaultOwner } = useVaultOwner(vault)

  // const { setStep: setLpStep } = useLiquidationPairSteps()

  // const { removeVault } = useDeployedVaults()

  // const onClickDeployLp = () => {
  //   setLpStep(0)
  //   router.push(`/lp/${vault.chainId}/${vault.address}`)
  // }

  // const onClickSetClaimer = () => {
  //   router.push(`/claimer/${vault.chainId}/${vault.address}`)
  // }

  // const onClickRemoveVault = () => {
  //   removeVault(vault)
  // }

  // const isVaultOwner =
  //   !!vaultOwner && !!address && vaultOwner.toLowerCase() === address.toLowerCase()

  // const iconClassName = 'h-6 w-6 text-pt-purple-300 cursor-pointer'
  // const ownerOnlyIconClassName = classNames(iconClassName, {
  //   'cursor-auto opacity-50': !isVaultOwner
  // })

  // return (
  //   <div className='flex gap-1 items-center'>
  //     <Tooltip content='Deploy LP'>
  //       <ArrowPathRoundedSquareIcon
  //         onClick={isVaultOwner ? onClickDeployLp : undefined}
  //         className={ownerOnlyIconClassName}
  //       />
  //     </Tooltip>
  //     <Tooltip content='Set Claimer'>
  //       <WrenchIcon
  //         onClick={isVaultOwner ? onClickSetClaimer : undefined}
  //         className={ownerOnlyIconClassName}
  //       />
  //     </Tooltip>
  //     <Tooltip content='Remove Vault'>
  //       <TrashIcon onClick={onClickRemoveVault} className={iconClassName} />
  //     </Tooltip>
  //   </div>
  // )

  return <></>
}

// NOTE: This is wrapped to avoid table overflow on spinner animation
const WrappedSpinner = () => {
  return (
    <div className='h-5 w-5 relative'>
      <Spinner className='absolute' />
    </div>
  )
}
