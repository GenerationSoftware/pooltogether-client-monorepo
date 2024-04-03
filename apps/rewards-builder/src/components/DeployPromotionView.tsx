import { LINKS } from '@shared/utilities'
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
      <WhitelistDisclaimer />
      <div className='flex gap-2 items-center'>
        <PrevButton className='w-36' />
        <DeployPromotionButton onSuccess={() => router.push('/')} />
      </div>
    </div>
  )
}

const WhitelistDisclaimer = () => {
  return (
    <span className='max-w-md text-center text-sm text-pt-teal-dark'>
      Only whitelisted reward tokens will be displayed on the Cabana app. Check out the list{' '}
      <a href={LINKS.rewardTokenWhitelist} target='_blank' className='underline'>
        here
      </a>{' '}
      and contact us if you'd like a token to be added!
    </span>
  )
}
