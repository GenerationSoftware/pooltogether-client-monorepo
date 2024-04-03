import { SECONDS_PER_DAY } from '@shared/utilities'
import { GetStaticProps } from 'next'
import { getMessages } from 'src/utils'
import { AccountDelegations } from '@components/Account/AccountDelegations'
import { AccountDeposits } from '@components/Account/AccountDeposits'
import { AccountOdds } from '@components/Account/AccountOdds'
import { AccountPromotions } from '@components/Account/AccountPromotions'
import { AccountWinnings } from '@components/Account/AccountWinnings'
import { CheckPrizesBanner } from '@components/Account/CheckPrizesBanner'
import { Layout } from '@components/Layout'

interface AccountPageProps {
  messages: IntlMessages
}

export const getStaticProps: GetStaticProps<AccountPageProps> = async ({ locale }) => {
  const messages = await getMessages(locale)

  return {
    props: { messages },
    revalidate: SECONDS_PER_DAY
  }
}

export default function AccountPage() {
  return (
    <Layout className='gap-6 lg:gap-8'>
      <CheckPrizesBanner />
      <AccountDeposits />
      <AccountDelegations />
      <AccountOdds className='-mt-3 lg:-mt-5' />
      <AccountPromotions />
      <AccountWinnings />
    </Layout>
  )
}
