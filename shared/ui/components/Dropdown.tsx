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
  itemWrapperClassName?: string
}

export const Dropdown = (props: DropdownProps) => {
  const { label, items, header, className, itemWrapperClassName, ...rest } = props

  const { isDesktop } = useScreenSize()

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  if (isDesktop) {
    return (
      <FlowbiteDropdown
        theme={{
          inlineWrapper: classNames('flex items-center shrink-0 pr-3', className),
          content: 'flex flex-col p-1',
          floating: {
            content: 'p-2',
            style: {
              auto: 'bg-pt-purple-100'
            }
          },
          arrowIcon: 'ml-2 h-4 w-4 stroke-[4]'
        }}
        label={label}
        {...rest}
      >
        <li>{header}</li>
        {items.map((item) => {
          return (
            <FlowbiteDropdown.Item
              key={`dd-${item.id}`}
              theme={{
                base: classNames(
                  'w-full flex items-center justify-center cursor-pointer',
                  itemWrapperClassName
                )
              }}
              onClick={() => item.onClick(item.id)}
            >
              {item.content}
            </FlowbiteDropdown.Item>
          )
        })}
      </FlowbiteDropdown>
    )
  }

  return (
    <>
      <span
        className={classNames(
          'flex items-center shrink-0 pr-3 cursor-pointer select-none',
          'border border-pt-purple-700 rounded-lg',
          className
        )}
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
      <span className='py-2'>{header}</span>
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
