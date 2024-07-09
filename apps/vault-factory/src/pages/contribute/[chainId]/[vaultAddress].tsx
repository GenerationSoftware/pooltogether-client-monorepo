import {
  usePrizePool,
  usePrizeTokenData,
  useVault,
  useVaultShareData
} from '@generationsoftware/hyperstructure-react-hooks'
import { Spinner } from '@shared/ui'
import { useRouter } from 'next/router'
import { SupportedNetwork } from 'src/types'
import { Address, isAddress } from 'viem'
import { ContributionAmountForm } from '@components/forms/ContributionAmountForm'
import { Layout } from '@components/Layout'
import { StepInfo } from '@components/StepInfo'
import { NETWORK_CONFIG, SUPPORTED_NETWORKS } from '@constants/config'

export default function ContributePage() {
  const router = useRouter()

  if (router.isReady) {
    const chainId =
      !!router.query.chainId &&
      typeof router.query.chainId === 'string' &&
      SUPPORTED_NETWORKS.includes(parseInt(router.query.chainId))
        ? (parseInt(router.query.chainId) as SupportedNetwork)
        : undefined

    const vaultAddress =
      !!router.query.vaultAddress &&
      typeof router.query.vaultAddress === 'string' &&
      isAddress(router.query.vaultAddress)
        ? router.query.vaultAddress
        : undefined

    if (!!chainId && !!vaultAddress) {
      return (
        <Layout isSidebarActive={true}>
          <div className='w-full flex flex-col grow gap-8 lg:flex-row lg:gap-4'>
            <div className='flex flex-col shrink-0 gap-8 items-center p-6 bg-pt-transparent lg:w-[27rem] lg:py-0 lg:pl-2 lg:pr-6 lg:bg-transparent'>
              <ContributeStepInfo chainId={chainId} vaultAddress={vaultAddress} />
            </div>
            <ContributeStepContent chainId={chainId} vaultAddress={vaultAddress} />
          </div>
        </Layout>
      )
    } else {
      router.replace('/')
    }
  }
}

interface ContributeStepInfoProps {
  chainId: SupportedNetwork
  vaultAddress: Address
}

const ContributeStepInfo = (props: ContributeStepInfoProps) => {
  const { chainId, vaultAddress } = props

  const vault = useVault({ chainId, address: vaultAddress })

  const { data: share } = useVaultShareData(vault)

  const prizePoolAddress = NETWORK_CONFIG[chainId]?.prizePool
  const prizePool = usePrizePool(chainId, prizePoolAddress)

  const { data: prizeToken } = usePrizeTokenData(prizePool)

  if (!share || !prizeToken) {
    return <Spinner className='my-auto' />
  }

  return (
    <StepInfo
      step={0}
      stepInfo={[
        {
          title: `Make a contribution to the ${share.symbol} vault`,
          info: `By contributing ${prizeToken.symbol} to the prize pool on behalf of the ${share.symbol} vault, you increase the chances of its depositors winning prizes.`
        }
      ]}
      setStep={() => {}}
      className='grow items-center justify-center lg:items-start'
    />
  )
}

interface ContributeStepContentProps {
  chainId: SupportedNetwork
  vaultAddress: Address
}

const ContributeStepContent = (props: ContributeStepContentProps) => {
  const { chainId, vaultAddress } = props

  const vault = useVault({ chainId, address: vaultAddress })

  const prizePoolAddress = NETWORK_CONFIG[chainId]?.prizePool
  const prizePool = usePrizePool(chainId, prizePoolAddress)

  const { data: prizeToken } = usePrizeTokenData(prizePool)

  return (
    <div className='flex grow items-center justify-center px-4 lg:px-0'>
      {!!prizeToken ? (
        <ContributionAmountForm vault={vault} prizeToken={prizeToken} />
      ) : (
        <Spinner />
      )}
    </div>
  )
}
