import classNames from 'classnames'
import { AddVaultForm } from '@components/forms/AddVaultForm'
import { VaultsTable } from '@components/VaultsTable'

interface VaultsSectionProps {
  className?: string
}

export const VaultsSection = (props: VaultsSectionProps) => {
  const { className } = props

  return (
    <section
      className={classNames('flex flex-col gap-4 py-4 lg:gap-8 lg:pl-16 lg:pr-4', className)}
    >
      <AddVaultForm />
      <VaultsTable className='h-full px-4 lg:px-0' innerClassName='lg:max-h-[75%]' />
    </section>
  )
}
