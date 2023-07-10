import { ListDetailsSection } from '@components/sections/ListDetailsSection'
import { VaultsSection } from '@components/sections/VaultsSection'

export const EditingView = () => {
  return (
    <div className='w-full flex flex-col grow lg:flex-row'>
      <ListDetailsSection className='w-full lg:w-1/3' />
      <VaultsSection className='w-full lg:w-2/3' />
    </div>
  )
}
