import { useRouter } from 'next/router'
import { SupportedNetwork } from 'src/types'
import { ExtendPromotionView } from '@components/ExtendPromotionView'
import { Layout } from '@components/Layout'
import { StepInfo } from '@components/StepInfo'
import { SUPPORTED_NETWORKS } from '@constants/config'

export default function ExtendPage() {
  const router = useRouter()

  if (router.isReady) {
    const chainId =
      !!router.query.chainId &&
      typeof router.query.chainId === 'string' &&
      SUPPORTED_NETWORKS.includes(parseInt(router.query.chainId))
        ? (parseInt(router.query.chainId) as SupportedNetwork)
        : undefined

    const promotionId =
      !!router.query.promotionId &&
      typeof router.query.promotionId === 'string' &&
      !isNaN(parseInt(router.query.promotionId))
        ? parseInt(router.query.promotionId)
        : undefined

    if (!!chainId && promotionId !== undefined) {
      return (
        <Layout isSidebarActive={true}>
          <div className='w-full flex flex-col grow gap-8 lg:flex-row lg:gap-4'>
            <div className='flex flex-col shrink-0 gap-8 items-center p-6 bg-pt-transparent lg:w-[27rem] lg:py-0 lg:pl-2 lg:pr-6 lg:bg-transparent'>
              <StepInfo
                step={0}
                stepInfo={[
                  {
                    title: 'Extend your promotion',
                    info: `You'll need to provide more tokens to distribute as rewards.`
                  }
                ]}
                setStep={() => {}}
                className='grow items-center justify-center lg:items-start'
              />
            </div>
            <div className='w-full flex flex-col gap-4 items-center justify-center'>
              <ExtendPromotionView chainId={chainId} promotionId={promotionId} />
            </div>
          </div>
        </Layout>
      )
    } else {
      router.replace('/')
    }
  }
}
