import { NETWORK } from '@pooltogether/hyperstructure-client-js'
import { useScreenSize } from '@shared/generic-react-hooks'
import { Dropdown, DropdownItem } from '@shared/ui'
import { useMemo } from 'react'
import { PrizePoolBadge } from '../Badges/PrizePoolBadge'

export interface PrizePoolDropdownProps {
  networks: NETWORK[]
  selectedNetwork: NETWORK
  onSelect: (chainId: number) => void
}

export const PrizePoolDropdown = (props: PrizePoolDropdownProps) => {
  const { networks, selectedNetwork, onSelect } = props

  const { isDesktop } = useScreenSize()

  const dropdownItems: DropdownItem[] = useMemo(
    () =>
      networks.map((network) => {
        if (isDesktop) {
          return {
            id: network.toString(),
            content: (
              <PrizePoolBadge
                chainId={network}
                hideBg={true}
                className='w-full justify-center p-2 hover:!bg-pt-purple-100/40'
                textClassName='text-pt-purple-600'
              />
            ),
            onClick: (id) => onSelect(parseInt(id))
          }
        }

        return {
          id: network.toString(),
          content: (
            <PrizePoolBadge
              chainId={network}
              className='w-full justify-center py-4 border-0'
              iconClassName='h-6 w-6'
              textClassName='font-averta font-semibold text-pt-purple-100'
            />
          ),
          onClick: (id) => onSelect(parseInt(id))
        }
      }),
    [isDesktop]
  )

  return (
    <Dropdown
      label={
        <PrizePoolBadge
          chainId={selectedNetwork}
          hideBg={true}
          className='gap-2 pr-0'
          iconClassName='h-8 w-8'
          textClassName='text-2xl font-semibold font-averta'
        />
      }
      items={dropdownItems}
      header={
        <span className='px-3 text-sm font-semibold text-pt-purple-50 md:mb-2 md:text-pt-purple-400'>
          Switch prize pool
        </span>
      }
      inline={true}
      placement='bottom'
    />
  )
}
