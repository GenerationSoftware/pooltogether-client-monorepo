import { Spinner } from '@shared/ui'
import { NETWORK } from '@shared/utilities'
import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'
import { useEffect } from 'react'
import { Address, isAddress } from 'viem'
import { useEnsAddress } from 'wagmi'
import { AccountDelegations } from './AccountDelegations'
import { AccountDeposits } from './AccountDeposits'
import { AccountOdds } from './AccountOdds'
import { AccountWinnings } from './AccountWinnings'

interface ExternalAccountPageContentProps {
  queryParams: ParsedUrlQuery
}

export const ExternalAccountPageContent = (props: ExternalAccountPageContentProps) => {
  const { queryParams } = props

  const router = useRouter()

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

  useEffect(() => {
    if (!user) {
      router.replace('/account')
    }
  }, [user])

  if (!!isEnsUser && !isFetchedAddressFromEns) {
    return <Spinner />
  }

  if (!!userAddress) {
    return (
      <>
        <AccountDeposits address={userAddress} />
        <AccountDelegations address={userAddress} />
        <AccountOdds address={userAddress} className='-mt-3 lg:-mt-5' />
        <AccountWinnings address={userAddress} />
      </>
    )
  }

  return <></>
}
