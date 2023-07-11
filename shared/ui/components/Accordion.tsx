import classNames from 'classnames'
import {
  Accordion as FlowbiteAccordion,
  AccordionProps as FlowbiteAccordionProps
} from 'flowbite-react'
import { ReactNode } from 'react'

export interface AccordionProps extends Omit<FlowbiteAccordionProps, 'children'> {
  items: { id: string; title: ReactNode; content: ReactNode; className?: string }[]
}

export const Accordion = (props: AccordionProps) => {
  const { items, className, ...rest } = props

  return (
    <FlowbiteAccordion
      className={classNames('border-none divide-y-0 overflow-hidden', className)}
      {...rest}
    >
      {items.map((item) => (
        <FlowbiteAccordion.Panel key={item.id} className={item.className}>
          <FlowbiteAccordion.Title
            theme={{
              base: 'w-full flex items-center justify-between px-3 py-1 font-medium text-pt-purple-100 first:rounded-t-lg last:rounded-b-lg',
              flush: { off: '' },
              open: {
                off: 'bg-pt-transparent text-pt-purple-100',
                on: 'bg-pt-transparent text-pt-purple-100'
              }
            }}
          >
            {item.title}
          </FlowbiteAccordion.Title>
          <FlowbiteAccordion.Content
            theme={{ base: 'px-3 py-2 bg-pt-transparent first:rounded-t-lg last:rounded-b-lg' }}
          >
            {item.content}
          </FlowbiteAccordion.Content>
        </FlowbiteAccordion.Panel>
      ))}
    </FlowbiteAccordion>
  )
}
