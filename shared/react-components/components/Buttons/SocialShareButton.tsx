import { Button, ButtonProps, LINKS, SocialIcon } from '@shared/ui'

interface SocialShareButtonProps extends Omit<ButtonProps, 'onClick' | 'href' | 'target'> {
  platform: 'twitter' | 'warpcast' | 'hey'
  text?: string
  hashTags?: string[]
}

const getHrefUrl = (platform: 'twitter' | 'warpcast' | 'hey') => {
  let url

  switch (platform) {
    case 'twitter': {
      url = 'https://twitter.com/intent/tweet'
      break
    }
    case 'warpcast': {
      url = 'https://warpcast.com/~/compose'
      break
    }
    case 'hey': {
      url = 'https://hey.xyz'
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
      theme={{
        size: {
          sm: 'px-4 py-2 sm:text-sm'
        },
        base: 'text-pt-purple-100 bg-pt-transparent border-pt-transparent hover:bg-pt-purple-50/20 focus:ring-pt-purple-50'
      }}
      {...rest}
    >
      <SocialIcon platform={platform} className='w-4 h-auto shrink-0 mr-1' />
      {children ?? platform}
    </Button>
  )
}
