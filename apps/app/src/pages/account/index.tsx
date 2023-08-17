import { SECONDS_PER_DAY } from '@shared/utilities'
import { GetStaticProps } from 'next'
import { getMessages } from 'src/utils'
import { AccountDeposits } from '@components/Account/AccountDeposits'
import { AccountWinnings } from '@components/Account/AccountWinnings'
import { CheckPrizesBanner } from '@components/Account/CheckPrizesBanner'
import { Layout } from '@components/Layout'

interface AccountPageProps {
  messages: IntlMessages
}

export const getStaticProps: GetStaticProps<AccountPageProps> = async ({ locale }) => {
  const messages = await getMessages(locale, { useDefault: true })

  return {
    props: { messages },
    revalidate: SECONDS_PER_DAY
  }
}

export default function AccountPage() {
  return (
    <Layout className='gap-6'>
      {/* <CheckPrizesBanner /> */}
      <AccountDeposits />
      <AccountWinnings />
    </Layout>
  )
}
