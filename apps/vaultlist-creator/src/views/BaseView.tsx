import { ListNameForm } from '@components/forms/ListNameForm'
import { IntroCard } from '@components/IntroCard'

export const BaseView = () => {
  return (
    <div className='mt-8 flex flex-col gap-16'>
      <IntroCard className='max-w-3xl' />
      <ListNameForm />
    </div>
  )
}
