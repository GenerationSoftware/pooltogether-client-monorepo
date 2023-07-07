import { CreateListForm } from '@components/forms/CreateListForm'
import { ImportListForm } from '@components/forms/ImportListForm'
import { IntroCard } from '@components/IntroCard'

export const BaseView = () => {
  return (
    <div className='w-full mt-8 flex flex-col gap-8'>
      <IntroCard className='max-w-3xl mx-auto' />
      <div className='flex items-center grow'>
        <CreateListForm className='w-1/2 pt-8 pb-16 border-r border-pt-purple-400' />
        <ImportListForm className='w-1/2 pt-8 pb-16' />
      </div>
    </div>
  )
}
