import classNames from 'classnames'
import { AddVaultForm } from '@components/forms/AddVaultForm'
import { VaultsTable } from '@components/VaultsTable'

interface VaultsSectionProps {
  className?: string
}

export const VaultsSection = (props: VaultsSectionProps) => {
  const { className } = props

  return (
    <section className={classNames('flex flex-col', className)}>
      <AddVaultForm />
      <VaultsTable />
    </section>
  )
}
