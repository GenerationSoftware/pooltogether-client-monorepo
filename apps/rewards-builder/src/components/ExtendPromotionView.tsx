import { TokenAmount } from '@shared/react-components'
import { Spinner } from '@shared/ui'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { ExtendPromotionButton } from '@components/buttons/ExtendPromotionButton'
import { ExtensionEpochsForm } from '@components/forms/ExtensionEpochsForm'
import { useAllPromotions } from '@hooks/useAllPromotions'

export interface ExtendPromotionViewProps {
  chainId: number
  promotionId: number
}

export const ExtendPromotionView = (props: ExtendPromotionViewProps) => {
  const { chainId, promotionId } = props

  const router = useRouter()

  const [numEpochs, setNumEpochs] = useState<number>(0)

  const { data: allPromotions, isFetched: isFetchedAllPromotions } = useAllPromotions()
  const promotionInfo = allPromotions[chainId]?.[promotionId]

  if (!isFetchedAllPromotions) {
    return <Spinner />
  }

  if (!!promotionInfo && !!promotionInfo.numberOfEpochs && promotionInfo.numberOfEpochs < 255) {
    return (
      <>
        <ExtensionEpochsForm
          numPromotionEpochs={promotionInfo.numberOfEpochs}
          onChange={setNumEpochs}
        />
        <div className='flex gap-2 text-lg'>
          <span className='font-semibold text-pt-purple-200'>Tokens Required:</span>
          <TokenAmount
            token={{
              chainId,
              address: promotionInfo.token,
              amount: promotionInfo.tokensPerEpoch * BigInt(numEpochs)
            }}
          />
        </div>
        <ExtendPromotionButton
          chainId={chainId}
          promotionId={promotionId}
          tokenAddress={promotionInfo.token}
          tokensPerEpoch={promotionInfo.tokensPerEpoch}
          numEpochs={numEpochs}
          onSuccess={() => router.push('/')}
          className='mt-2'
        />
      </>
    )
  }

  return <>This promotion cannot be extended.</>
}
