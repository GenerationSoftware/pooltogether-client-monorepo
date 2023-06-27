import { AccountDeposits } from '@components/Account/AccountDeposits'
import { AccountWinnings } from '@components/Account/AccountWinnings'
import { Layout } from '@components/Layout'

export default function AccountPage() {
  return (
    <Layout className='gap-6'>
      <AccountDeposits />
      <AccountWinnings />
    </Layout>
  )
}
