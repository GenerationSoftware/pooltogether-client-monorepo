import { BackButton } from '@components/buttons/BackButton'
import { CodeSection } from '@components/sections/CodeSection'

export const PreviewView = () => {
  return (
    <div className='w-full flex flex-col'>
      <BackButton toView='editing' text='Continue Editing' />
      <CodeSection className='max-w-2xl mx-auto' />
    </div>
  )
}
