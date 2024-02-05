import { Intl } from '@shared/types'
import { Button, ButtonProps } from '@shared/ui'
import { SocialIcon } from '@shared/ui'

interface HeyShareButtonProps extends Omit<ButtonProps, 'onClick' | 'href' | 'target'> {
  text?: string
  url: string
  hashTags?: string[]
  intl?: Intl<'shareHey'>
}

export const HeyShareButton = (props: HeyShareButtonProps) => {
  const { text, url, hashTags, intl, children, disabled, ...rest } = props

  const href = new URL('https://hey.xyz')
  !!text && href.searchParams.set('text', text)
  !!url && href.searchParams.set('url', encodeURI(url))
  !!hashTags &&
    hashTags.length > 0 &&
    href.searchParams.set('hashtags', hashTags.map((h) => h.replace(' ', '')).join(','))

  return (
    <Button
      href={href.toString()}
      target='_blank'
      disabled={text === undefined || disabled}
      color='transparent'
      {...rest}
    >
      <SocialIcon platform='hey' className='w-4 h-auto shrink-0 mr-1' />
      {children ?? 'Hey'}
    </Button>
  )
}
