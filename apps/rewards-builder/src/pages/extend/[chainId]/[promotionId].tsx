import { PromotionInfo } from '@shared/types'
import { Spinner } from '@shared/ui'
import { useRouter } from 'next/router'
import { SupportedNetwork } from 'src/types'
import { ExtensionEpochsForm } from '@components/forms/ExtensionEpochsForm'
import { Layout } from '@components/Layout'
import { StepInfo } from '@components/StepInfo'
import { SUPPORTED_NETWORKS } from '@constants/config'
import { useAllPromotions } from '@hooks/useAllPromotions'

export default function ExtendPage() {
  const router = useRouter()

  const { data: allPromotions, isFetched: isFetchedAllPromotions } = useAllPromotions()

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
      const promotionInfo = allPromotions[chainId]?.[promotionId]

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
            {isFetchedAllPromotions ? (
              !!promotionInfo &&
              !!promotionInfo.numberOfEpochs &&
              promotionInfo.numberOfEpochs < 255 ? (
                <ExtensionEpochsForm
                  chainId={chainId}
                  promotionId={promotionId}
                  promotionInfo={promotionInfo as PromotionInfo}
                />
              ) : (
                <>This promotion cannot be extended.</>
              )
            ) : (
              <Spinner />
            )}
          </div>
        </Layout>
      )
    } else {
      router.replace('/')
    }
  }
}
