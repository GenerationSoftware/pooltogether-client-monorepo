import { Intl } from '@shared/types'
import { Button, ButtonProps } from '@shared/ui'

interface TwitterShareButtonProps extends Omit<ButtonProps, 'onClick' | 'href' | 'target'> {
  text?: string
  url?: string
  hashTags?: string[]
  intl?: Intl<'shareTwitter'>
}

export const TwitterShareButton = (props: TwitterShareButtonProps) => {
  const { text, url, hashTags, intl, children, disabled, ...rest } = props

  const href = new URL('https://twitter.com/intent/tweet')
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
      {...rest}
    >
      {children ?? intl?.('shareTwitter') ?? 'Share Tweet'}
    </Button>
  )
}
