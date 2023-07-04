import { ListDetailsSection } from '@components/sections/ListDetailsSection'
import { VaultsSection } from '@components/sections/VaultsSection'

export const EditingView = () => {
  return (
    <div className='flex'>
      <ListDetailsSection />
      <VaultsSection />
    </div>
  )
}
