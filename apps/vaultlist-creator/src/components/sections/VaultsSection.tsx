import classNames from 'classnames'
import { AddVaultForm } from '@components/forms/AddVaultForm'
import { VaultsTable } from '@components/VaultsTable'

interface VaultsSectionProps {
  className?: string
}

export const VaultsSection = (props: VaultsSectionProps) => {
  const { className } = props

  return (
    <section className={classNames('flex flex-col gap-8 p-4 pl-16', className)}>
      <AddVaultForm />
      <VaultsTable className='h-full' innerClassName='max-h-[75%]' />
    </section>
  )
}
