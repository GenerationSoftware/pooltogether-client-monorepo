import { Intl } from '@shared/types'
import { Button, ButtonProps } from '@shared/ui'

interface WarpcastShareButtonProps extends Omit<ButtonProps, 'onClick' | 'href' | 'target'> {
  text?: string
  url: string
  intl?: Intl<'shareWarpcast'>
}

export const WarpcastShareButton = (props: WarpcastShareButtonProps) => {
  const { text, url, intl, children, disabled, ...rest } = props

  const href = new URL('https://warpcast.com/~/compose')
  !!text && href.searchParams.set('text', text + '\n\n' + url)

  return (
    <Button
      href={href.toString()}
      target='_blank'
      disabled={text === undefined || disabled}
      {...rest}
    >
      {children ?? intl?.('shareWarpcast') ?? 'Share on Warpcast'}
    </Button>
  )
}
