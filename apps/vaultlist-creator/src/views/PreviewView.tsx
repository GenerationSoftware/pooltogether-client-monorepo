import { BackButton } from '@components/buttons/BackButton'
import { CodeSection } from '@components/sections/CodeSection'
import { HostingSection } from '@components/sections/HostingSection'

export const PreviewView = () => {
  return (
    <div className='w-full flex flex-col gap-8 px-6 lg:px-0'>
      <BackButton toView='editing' text='Back to Editing' />
      <div className='flex flex-col gap-6 lg:flex-row'>
        <CodeSection className='w-full lg:w-1/2' />
        <HostingSection className='w-full lg:w-1/2' />
      </div>
    </div>
  )
}
