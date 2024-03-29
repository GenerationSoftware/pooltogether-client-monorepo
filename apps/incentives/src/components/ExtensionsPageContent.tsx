import Image from 'next/image'
import { ReactNode } from 'react'
import { ResourceLink } from './ResourceLink'
import { SimpleSection } from './SimpleSection'

interface ExtensionsPageContentProps {
  title: string
  description: string
  img: { src: string; width: number; height: number }
  idea: ReactNode
  communityLinks: { name: string; href: string }[]
  resources: { name: string; href: string }[]
}

export const ExtensionsPageContent = (props: ExtensionsPageContentProps) => {
  const { title, description, img, idea, communityLinks, resources } = props

  return (
    <>
      <Image {...img} alt={title} className='w-full h-48' />
      <div className='w-full flex flex-col gap-1 items-center text-center'>
        <h1 className='text-5xl'>{title}</h1>
        <span className='text-xl italic'>{description}</span>
      </div>
      <hr className='w-full border-pt-purple-300' />
      <div className='w-full grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-2'>
        <SimpleSection title={`What's the idea?`} content={idea} />
        <div className='flex flex-col gap-6'>
          <SimpleSection
            title='Connect with the community'
            content={
              <div className='flex flex-col gap-4 items-start'>
                {communityLinks.map((communityLink) => (
                  <ResourceLink key={communityLink.name} href={communityLink.href}>
                    {communityLink.name}
                  </ResourceLink>
                ))}
              </div>
            }
          />
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
      </div>
    </>
  )
}
