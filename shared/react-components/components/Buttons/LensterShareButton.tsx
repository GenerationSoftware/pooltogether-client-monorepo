import { Intl } from '@shared/types'
import '@shared/ui'
import { Button, ButtonProps } from '@shared/ui'

interface LensterShareButtonProps extends Omit<ButtonProps, 'onClick' | 'href' | 'target'> {
  text?: string
  url: string
  hashTags?: string[]
  intl?: Intl<'shareLenster'>
}

export const LensterShareButton = (props: LensterShareButtonProps) => {
  const { text, url, hashTags, intl, children, disabled, ...rest } = props

  const href = new URL('http://lenster.xyz')
  !!text && href.searchParams.set('text', text)
  !!url && href.searchParams.set('url', encodeURI(url))
  !!hashTags && hashTags.length > 0 && href.searchParams.set('hashtags', hashTags.join(','))

  return (
    <Button
      href={href.toString()}
      target='_blank'
      disabled={text === undefined || disabled}
      {...rest}
    >
      {children ?? intl?.('shareLenster') ?? 'Share on Lenster'}
    </Button>
  )
}
