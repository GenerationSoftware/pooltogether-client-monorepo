import { NetworkBadge } from '@shared/react-components'
import { Dropdown, DropdownItem, Spinner } from '@shared/ui'
import { getNetworkNameByChainId, NETWORK } from '@shared/utilities'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { useSelectedChainId } from '@hooks/useSelectedChainId'
import { useValidNetworks } from '@hooks/useValidNetworks'

export interface NetworkDropdownProps {
  className?: string
}

export const NetworkDropdown = (props: NetworkDropdownProps) => {
  const { className } = props

  const router = useRouter()

  const validNetworks = useValidNetworks()

  const onChangeNetwork = (newNetwork: NETWORK) => {
    const currentPage = router.pathname.split('/')[2] ?? ''
    router.replace(
      `/${getNetworkNameByChainId(newNetwork)}${!!currentPage ? `/${currentPage}` : ''}`
    )
  }

  const dropdownItems: DropdownItem[] = useMemo(() => {
    return validNetworks.map((network) => ({
      id: network.toString(),
      content: (
        <NetworkBadge
          chainId={network}
          hideBg={true}
          className='md:text-pt-purple-600 select-none'
        />
      ),
      onClick: (id) => onChangeNetwork(parseInt(id))
    }))
  }, [validNetworks])

  if (dropdownItems.length < 2) {
    return <Label />
  }

  return (
    <Dropdown
      label={<Label />}
      items={dropdownItems}
      inline={true}
      placement='bottom'
      className={className}
    />
  )
}

const Label = () => {
  const { chainId, isReady } = useSelectedChainId()

  if (!isReady) {
    return <Spinner className='after:border-y-pt-purple-300' />
  }

  if (!chainId) {
    return <>?</>
  }

  return (
    <NetworkBadge
      chainId={chainId}
      hideBg={true}
      className='pr-0 select-none md:pl-0'
      iconClassName='h-6 w-6'
      textClassName='font-bold text-pt-purple-400'
    />
  )
}
