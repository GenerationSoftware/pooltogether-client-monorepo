import { ReactNode } from 'react'
import { ResourceLink } from './ResourceLink'
import { SimpleSection } from './SimpleSection'

interface IncentivesPageContentProps {
  title: string
  actions: ReactNode
  incentive: ReactNode
  resources: { name: string; href: string }[]
}

export const IncentivesPageContent = (props: IncentivesPageContentProps) => {
  const { title, actions, incentive, resources } = props

  return (
    <>
      <h1 className='w-full text-5xl'>{title}</h1>
      <hr className='w-full border-pt-purple-300' />
      <div className='w-full grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-2'>
        <SimpleSection title='What needs to be done?' content={actions} />
        <SimpleSection title='What is the incentive?' content={incentive} />
        <SimpleSection
          title='Resources'
          content={
            <div className='flex flex-col gap-4 items-start'>
              {resources.map((resource) => (
                <ResourceLink key={resource.name} href={resource.href}>
                  {resource.name}
                </ResourceLink>
              ))}
            </div>
          }
        />
      </div>
    </>
  )
}
