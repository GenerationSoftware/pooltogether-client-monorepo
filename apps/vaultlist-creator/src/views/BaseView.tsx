import { CreateListForm } from '@components/forms/CreateListForm'
import { ImportListForm } from '@components/forms/ImportListForm'
import { IntroCard } from '@components/IntroCard'

export const BaseView = () => {
  return (
    <div className='w-full flex flex-col gap-8 px-8 lg:mt-8 lg:px-0'>
      <IntroCard className='max-w-3xl mx-auto' />
      <div className='flex flex-col items-center grow lg:flex-row'>
        <CreateListForm className='w-full pb-6 border-b border-pt-purple-400 lg:w-1/2 lg:pt-8 lg:pb-16 lg:border-r lg:border-b-0' />
        <ImportListForm className='w-full pt-6 lg:w-1/2 lg:pt-8 lg:pb-16' />
      </div>
    </div>
  )
}
