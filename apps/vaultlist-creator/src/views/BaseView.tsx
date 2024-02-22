import { CreateListForm } from '@components/forms/CreateListForm'
import { ImportListForm } from '@components/forms/ImportListForm'

export const BaseView = () => {
  return (
    <div className='w-full flex flex-col gap-8 px-8 md:gap-20 lg:mt-8 lg:px-0'>
      <span className='text-center text-3xl font-grotesk font-medium text-pt-purple-100 lg:text-[2.5rem]'>
        Create and edit vault lists for PoolTogether V5
      </span>
      <div className='flex flex-col items-center grow lg:flex-row'>
        <CreateListForm className='w-full pb-6 border-b border-pt-purple-600 lg:w-1/2 lg:pt-8 lg:pb-16 lg:border-r lg:border-b-0' />
        <ImportListForm className='w-full pt-6 lg:w-1/2 lg:pt-8 lg:pb-16' />
      </div>
    </div>
  )
}
