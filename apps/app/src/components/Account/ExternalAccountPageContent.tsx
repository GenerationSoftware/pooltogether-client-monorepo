import { Spinner } from '@shared/ui'
import { NETWORK } from '@shared/utilities'
import { ParsedUrlQuery } from 'querystring'
import { Address, isAddress } from 'viem'
import { useEnsAddress } from 'wagmi'
import { PageNotFound } from '@components/PageNotFound'
import { AccountDeposits } from './AccountDeposits'
import { AccountWinnings } from './AccountWinnings'

interface ExternalAccountPageContentProps {
  queryParams: ParsedUrlQuery
}

export const ExternalAccountPageContent = (props: ExternalAccountPageContentProps) => {
  const { queryParams } = props

  const user =
    !!queryParams.user &&
    typeof queryParams.user === 'string' &&
    (isAddress(queryParams.user) || queryParams.user.endsWith('.eth'))
      ? queryParams.user
      : undefined
  const isEnsUser = !!user && user.endsWith('.eth')

  const { data: addressFromEns, isFetched: isFetchedAddressFromEns } = useEnsAddress({
    chainId: NETWORK.mainnet,
    name: user,
    enabled: isEnsUser
  })

  const userAddress = (isEnsUser ? addressFromEns : user) as Address | undefined

  if (!!isEnsUser && !isFetchedAddressFromEns) {
    return <Spinner />
  }

  if (!!userAddress) {
    return (
      <>
        <AccountDeposits address={userAddress} />
        <AccountWinnings address={userAddress} />
      </>
    )
  }

  return <PageNotFound className='grow' />
}
