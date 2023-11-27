import classNames from 'classnames'
import { useRouter } from 'next/router'
import { DeployPromotionButton } from './buttons/DeployPromotionButton'
import { PrevButton } from './buttons/PrevButton'
import { PromotionPreview } from './PromotionPreview'

interface DeployPromotionViewProps {
  className?: string
}

export const DeployPromotionView = (props: DeployPromotionViewProps) => {
  const { className } = props

  const router = useRouter()

  return (
    <div className={classNames('flex flex-col grow gap-12 items-center', className)}>
      <PromotionPreview className='max-w-md' />
      {/* TODO: add disclaimer about promotions being displayed on the cabana app */}
      <div className='flex gap-2 items-center'>
        <PrevButton className='w-36' />
        <DeployPromotionButton onSuccess={() => router.push('/')} />
      </div>
    </div>
  )
}
