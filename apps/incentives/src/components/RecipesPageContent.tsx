import { ReactNode } from 'react'
import { ResourceLink } from './ResourceLink'
import { SimpleSection } from './SimpleSection'

interface RecipesPageContentProps {
  title: string
  description: string
  instructions: ReactNode
  ingredients: string[]
  resources: { name: string; href: string }[]
}

export const RecipesPageContent = (props: RecipesPageContentProps) => {
  const { title, description, instructions, ingredients, resources } = props

  return (
    <>
      <h1 className='w-full text-5xl'>{title}</h1>
      <span className='w-full text-xl italic text-left'>{description}</span>
      <hr className='w-full border-pt-purple-300' />
      <div className='w-full grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-2'>
        <SimpleSection
          title='Instructions'
          content={<ol className='flex flex-col gap-2 pl-6 list-decimal'>{instructions}</ol>}
        />
        <div className='flex flex-col gap-6'>
          <SimpleSection
            title='Ingredients'
            content={
              <div className='flex flex-col text-3xl'>
                {ingredients.map((ingredient) => (
                  <span key={ingredient}>{ingredient}</span>
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
