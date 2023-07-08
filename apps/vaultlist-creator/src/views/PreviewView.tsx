import { BackButton } from '@components/buttons/BackButton'
import { CodeSection } from '@components/sections/CodeSection'
import { HostingSection } from '@components/sections/HostingSection'

export const PreviewView = () => {
  return (
    <div className='w-full flex flex-col gap-8'>
      <BackButton toView='editing' text='Back to Editing' />
      <div className='flex gap-6'>
        <CodeSection className='w-1/2' />
        <HostingSection className='w-1/2' />
      </div>
    </div>
  )
}
