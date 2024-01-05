import { useRouter } from 'next/router'
import { useState } from 'react'
import { Address } from 'viem'
import { DestroyPromotionButton } from '@components/buttons/DestroyPromotionButton'
import { RecipientForm } from '@components/forms/RecipientForm'

export interface DestroyPromotionViewProps {
  chainId: number
  promotionId: number
}

export const DestroyPromotionView = (props: DestroyPromotionViewProps) => {
  const { chainId, promotionId } = props

  const router = useRouter()

  const [recipient, setRecipient] = useState<Address | undefined>(undefined)

  return (
    <>
      <RecipientForm onChange={setRecipient} />
      <DestroyPromotionButton
        chainId={chainId}
        promotionId={promotionId}
        recipient={recipient as Address}
        onSuccess={() => router.push('/')}
        className='mt-2'
      />
    </>
  )
}
