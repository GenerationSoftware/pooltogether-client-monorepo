import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { useScreenSize } from '@shared/generic-react-hooks'
import classNames from 'classnames'
import {
  Dropdown as FlowbiteDropdown,
  DropdownProps as FlowbiteDropdownProps
} from 'flowbite-react'
import { ReactNode, useState } from 'react'
import { Modal } from './Modal'

export interface DropdownItem {
  id: string
  content: ReactNode
  onClick: (id: string) => void
}

export interface DropdownProps extends Omit<FlowbiteDropdownProps, 'label'> {
  label: ReactNode
  items: DropdownItem[]
  header?: ReactNode
}

export const Dropdown = (props: DropdownProps) => {
  const { label, items, header, className, ...rest } = props

  const { isDesktop } = useScreenSize()

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  if (isDesktop) {
    return (
      <FlowbiteDropdown
        theme={{
          inlineWrapper: 'flex items-center pr-3',
          content: 'flex flex-col items-center',
          floating: {
            content: 'px-2 py-2',
            style: {
              auto: 'bg-pt-purple-50'
            }
          },
          arrowIcon: 'ml-2 h-4 w-4 stroke-[4]'
        }}
        label={label}
        className={classNames(className)}
        {...rest}
      >
        <>
          {header}
          {items.map((item) => {
            return (
              <FlowbiteDropdown.Item
                key={`dd-${item.id}`}
                theme={{ base: 'flex items-center justify-center w-full cursor-pointer' }}
                onClick={() => item.onClick(item.id)}
              >
                {item.content}
              </FlowbiteDropdown.Item>
            )
          })}
        </>
      </FlowbiteDropdown>
    )
  }

  return (
    <>
      <span
        className='flex items-center pr-3 border border-pt-purple-700 rounded-lg cursor-pointer select-none'
        onClick={() => setIsModalOpen(true)}
      >
        {label} <ChevronDownIcon className='ml-2 h-4 w-4 stroke-[4]' />
      </span>
      {isModalOpen && (
        <Modal
          bodyContent={
            <DropdownModalBodyContent
              items={items}
              setIsModalOpen={setIsModalOpen}
              header={header}
            />
          }
          bodyClassName='flex flex-col gap-4 items-center'
          onClose={() => setIsModalOpen(false)}
          label='dropdown-modal'
          mobileStyle='tab'
          hideHeader={true}
        />
      )}
    </>
  )
}

interface DropdownModalBodyContentProps {
  items: DropdownItem[]
  setIsModalOpen: (val: boolean) => void
  header?: ReactNode
}

const DropdownModalBodyContent = (props: DropdownModalBodyContentProps) => {
  const { items, setIsModalOpen, header } = props

  return (
    <>
      {header}
      {items.map((item) => (
        <div
          key={`dd-modal-${item.id}`}
          onClick={() => {
            item.onClick(item.id)
            setIsModalOpen(false)
          }}
          className='w-full cursor-pointer'
        >
          {item.content}
        </div>
      ))}
    </>
  )
}
