import { useRouter } from 'next/router'
import { useState } from 'react'
import { Address } from 'viem'
import { EndPromotionButton } from '@components/buttons/EndPromotionButton'
import { RecipientForm } from '@components/forms/RecipientForm'

export interface EndPromotionViewProps {
  chainId: number
  promotionId: number
}

export const EndPromotionView = (props: EndPromotionViewProps) => {
  const { chainId, promotionId } = props

  const router = useRouter()

  const [recipient, setRecipient] = useState<Address | undefined>(undefined)

  return (
    <>
      <RecipientForm onChange={setRecipient} />
      <EndPromotionButton
        chainId={chainId}
        promotionId={promotionId}
        recipient={recipient as Address}
        onSuccess={() => router.push('/')}
        className='mt-2'
      />
    </>
  )
}
