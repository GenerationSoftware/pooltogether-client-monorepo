import { useRouter } from 'next/router'
import { Address, isAddress } from 'viem'
import { useAccount } from 'wagmi'
import { Layout } from '@components/Layout'
import { V4Migration } from '@components/V4/V4Migration'
import { SUPPORTED_NETWORKS, SupportedNetwork } from '@constants/config'
import { useUserV3Balances } from '@hooks/useUserV3Balances'
import { useUserV4Balances } from '@hooks/useUserV4Balances'

export default function MigrationPage() {
  const router = useRouter()

  const { address: userAddress } = useAccount()

  const { data: userV4Balances } = useUserV4Balances(userAddress as Address)
  const { data: userV3Balances } = useUserV3Balances(userAddress as Address)

  if (router.isReady) {
    const chainId =
      !!router.query.chainId &&
      typeof router.query.chainId === 'string' &&
      SUPPORTED_NETWORKS.includes(parseInt(router.query.chainId))
        ? (parseInt(router.query.chainId) as SupportedNetwork)
        : undefined

    const version =
      (!!router.query.version &&
        typeof router.query.version === 'string' &&
        router.query.version === 'v4') ||
      router.query.version === 'v3'
        ? router.query.version
        : undefined

    const tokenAddress =
      !!router.query.tokenAddress &&
      typeof router.query.tokenAddress === 'string' &&
      isAddress(router.query.tokenAddress)
        ? (router.query.tokenAddress.toLowerCase() as Lowercase<Address>)
        : undefined

    if (!!userAddress && !!chainId && !!version && !!tokenAddress) {
      if (version === 'v4') {
        const v4Migration = userV4Balances.find(
          (balance) => balance.token.address.toLowerCase() === tokenAddress
        )

        if (!!v4Migration) {
          return (
            <Layout>
              <V4Migration userAddress={userAddress} migration={v4Migration} />
            </Layout>
          )
        }
      } else if (version === 'v3') {
        const v3Migration = userV3Balances.find(
          (balance) => balance.token.address.toLowerCase() === tokenAddress
        )

        if (!!v3Migration) {
          // TODO
          return <Layout>V3 Migration</Layout>
        }
      }
    }

    router.replace('/')
  }
}
