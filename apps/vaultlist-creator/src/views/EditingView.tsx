import { ListDetailsSection } from '@components/sections/ListDetailsSection'
import { VaultsSection } from '@components/sections/VaultsSection'

export const EditingView = () => {
  return (
    <div className='w-full flex grow'>
      <ListDetailsSection className='w-1/3' />
      <VaultsSection className='w-2/3' />
    </div>
  )
}
