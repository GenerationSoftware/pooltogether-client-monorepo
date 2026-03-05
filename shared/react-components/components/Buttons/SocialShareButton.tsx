import { Button, ButtonProps, SocialIcon } from '@shared/ui'
import { LINKS } from '@shared/utilities'

export interface SocialShareButtonProps extends Omit<ButtonProps, 'onClick' | 'href' | 'target'> {
  platform: 'twitter' | 'farcaster'
  text?: string
  hashTags?: string[]
}

const getHrefUrl = (platform: 'twitter' | 'farcaster') => {
  let url

  switch (platform) {
    case 'twitter': {
      url = 'https://twitter.com/intent/tweet'
      break
    }
    case 'farcaster': {
      url = 'https://farcaster.xyz/~/compose'
      break
    }
  }

  return new URL(url)
}

export const SocialShareButton = (props: SocialShareButtonProps) => {
  const { platform, text, hashTags, children, disabled, ...rest } = props

  const href = getHrefUrl(platform)
  href.searchParams.set('url', encodeURI(LINKS.app))
  !!hashTags &&
    hashTags.length > 0 &&
    href.searchParams.set('hashtags', hashTags.map((h) => h.replace(' ', '')).join(','))
  !!text && href.searchParams.set('text', text)

  return (
    <Button
      href={href.toString()}
      target='_blank'
      disabled={text === undefined || disabled}
      color='transparent'
      className='capitalize'
      fullSized={true}
      size='sm'
      {...rest}
    >
      <SocialIcon platform={platform} className='w-4 h-auto shrink-0 mr-1' />
      {children ?? platform}
    </Button>
  )
}
