import { TokenWithAmount } from '@shared/types'
import { formatBigIntForDisplay, shorten } from '@shared/utilities'
import { CSSProperties, ReactNode } from 'react'
import { isAddress } from 'viem'

interface FrameImageProps {
  children: ReactNode
  style?: CSSProperties
}

export const FrameImage = (props: FrameImageProps) => {
  const { children, style } = props

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '32px',
        fontSize: 32,
        color: '#F5F0FF',
        background: '#21064E',
        ...style
      }}
    >
      {children}
    </div>
  )
}

interface UserCardProps {
  user: string
  style?: CSSProperties
  maxChars?: number
}

export const UserCard = (props: UserCardProps) => {
  const { user, style, maxChars } = props

  const defaultMaxChars = 14
  const formattedUser = isAddress(user)
    ? (shorten(user) as string)
    : user.length > (maxChars ?? defaultMaxChars)
    ? `${user.slice(0, maxChars ?? defaultMaxChars)}...`
    : user

  return (
    <Card style={{ flexGrow: 1, fontSize: 24, background: '#36147D', ...style }}>
      <span>Account:</span>
      <span>{formattedUser}</span>
    </Card>
  )
}

interface CardProps {
  children: ReactNode
  style?: CSSProperties
}

export const Card = (props: CardProps) => {
  const { children, style } = props

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '32px',
        background: '#4C249F',
        borderRadius: '12px',
        ...style
      }}
    >
      {children}
    </div>
  )
}

interface VaultBalanceProps {
  token: TokenWithAmount
  style?: CSSProperties
}

export const VaultBalance = (props: VaultBalanceProps) => {
  const { token, style } = props

  const formattedTokenAmount = formatBigIntForDisplay(token.amount, token.decimals)

  return (
    <div style={{ display: 'flex', gap: '8px', ...style }}>
      {/* TODO: add token logo */}
      <span>{formattedTokenAmount}</span>
      <span>{token.symbol}</span>
    </div>
  )
}

interface CabanaLogoProps {
  style?: CSSProperties
  height?: number
  width?: number
}

export const CabanaLogo = (props: CabanaLogoProps) => {
  const { style, height, width } = props

  return (
    <div style={{ display: 'flex', ...style }}>
      <svg
        width={height ? height * (152 / 34) : width ?? 152 * 1.5}
        height={width ? width * (34 / 152) : height ?? 34 * 1.5}
        id='e0ZU5LIvkCi1'
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 152 34'
        shapeRendering='geometricPrecision'
        textRendering='geometricPrecision'
      >
        <ellipse rx='16' ry='16.0001' transform='translate(16 17.0001)' fill='#8050e3' />
        <g transform='translate(0-5)' mask='url(#e0ZU5LIvkCi12)'>
          <g>
            <path
              d='M15.2197,18.9688c-.2614,5.997-.1493,19.7381,2.391,26.7262'
              fill='none'
              stroke='#deceff'
              strokeWidth='3.20001'
              strokeLinecap='round'
            />
            <path
              d='M15.636,20.4391c-.2677-3.4516-1.3617-11.30973-8.59122-5.9156c2.4972-.1315,6.71242,2.7103,8.59122,5.9156Z'
              fill='#deceff'
              stroke='#c8adff'
              strokeWidth='1.13548'
            />
            <path
              d='M15.5335,21.5707c-1.9038-3.5033-6.75859-8.2549-10.94727.7651C6.86242,21.04,12.2385,19.073,15.5335,21.5707Z'
              fill='#deceff'
              stroke='#c8adff'
              strokeWidth='1.13548'
            />
            <path
              d='M16.4489,22.1061c-3.1515-1.7353-9.5374-2.5551-8.2332,6.2628c1.06707-2.0679,4.5348-6.5728,8.2332-6.2628Z'
              fill='#deceff'
              stroke='#c8adff'
              strokeWidth='1.13548'
            />
            <path
              d='M15.585,21.006c.1244-2.6711,1.6989-11.46673,8.1277-7.8196-2.1667.0711-6.6005,5.2267-8.1277,7.8196Z'
              fill='#deceff'
              stroke='#c8adff'
              strokeWidth='1.13548'
            />
            <path
              d='M15.5337,21.5713c1.8237-3.7094,6.5629-8.8408,10.9298.3083-2.2966-1.2403-7.6979-3.0385-10.9298-.3083Z'
              fill='#deceff'
              stroke='#c8adff'
              strokeWidth='1.13548'
            />
            <path
              d='M15.4816,22.1373c3.1071-1.8011,9.2731-2.8695,7.9225,5.7781-1.0309-1.9809-4.29-6.2074-7.9225-5.7781Z'
              fill='#deceff'
              stroke='#c8adff'
              strokeWidth='1.13548'
            />
          </g>
          <mask
            id='e0ZU5LIvkCi12'
            x='-150%'
            y='-150%'
            height='400%'
            width='400%'
            style={{ maskType: 'alpha' }}
          >
            <ellipse rx='16' ry='16.0001' transform='translate(16 22.0001)' fill='#8050e3' />
          </mask>
        </g>
        <path
          d='M37.6793,22.3018c0-6.5887,4.7207-11.1057,10.9698-11.1057c6.5548,0,10.0529,4.1774,10.4605,9.5095l-5.5359.2037c-.3396-2.3773-1.6302-4.5849-4.9585-4.5849-3.1585,0-4.9925,2.3434-4.9925,5.9774s1.834,5.9774,4.9925,5.9774c3.3283,0,4.6189-2.2076,4.9585-4.5849l5.5359.2377c-.4076,5.3321-3.9057,9.4756-10.4605,9.4756-6.2491,0-10.9698-4.5171-10.9698-11.1058ZM69.9757,26.683v-.2378l-2.2415.4076c-1.3245.2717-2.1057.6792-2.1057,1.6641c0,.7812.6114,1.2906,1.5284,1.2906c1.5622,0,2.8188-1.1547,2.8188-3.1245Zm5.4001-3.2944v5.1623c0,.7811.3396,1.1208.917,1.1208.4415,0,.7811-.068,1.2226-.2378v2.9208c-.7811.5434-1.8679.9849-3.4302.9849-1.8679,0-3.3283-.9509-3.8378-2.683-.883,1.766-2.6151,2.683-5.0264,2.683-2.9548,0-4.8906-1.5283-4.8906-4.1094c0-2.9208,2.1057-4.1774,5.4-4.7548l4.2453-.7132v-.2377c0-1.2567-.5773-2.0038-1.9019-2.0038-1.2226,0-1.8339.7811-2.0717,1.9019l-5.0944-.3397c.4755-3.3283,2.9548-5.6377,7.5058-5.6377c4.0075,0,6.9623,1.7321,6.9623,5.9434Zm9.2495,1.9359v.2037c0,2.2076,1.1886,3.634,3.0566,3.634c2.1396,0,3.1245-1.5283,3.1245-3.7358c0-2.1736-.9849-3.702-3.1245-3.702-1.868,0-3.0566,1.4265-3.0566,3.6001Zm-.3057,5.0604L83.3686,33h-4.2453v-21.3964h5.502v8.8642c.7471-1.8,2.4453-3.0226,4.9924-3.0226c4.4491,0,6.7246,3.5321,6.7246,7.9812c0,4.483-2.2755,7.9812-6.8264,7.9812-2.4453,0-4.3472-1.1887-5.1963-3.0227ZM107.288,26.683v-.2378l-2.241.4076c-1.325.2717-2.106.6792-2.106,1.6641c0,.7812.611,1.2906,1.528,1.2906c1.562,0,2.819-1.1547,2.819-3.1245Zm5.4-3.2944v5.1623c0,.7811.34,1.1208.917,1.1208.442,0,.781-.068,1.223-.2378v2.9208c-.781.5434-1.868.9849-3.43.9849-1.868,0-3.329-.9509-3.838-2.683-.883,1.766-2.615,2.683-5.027,2.683-2.9544,0-4.8903-1.5283-4.8903-4.1094c0-2.9208,2.1057-4.1774,5.4003-4.7548l4.245-.7132v-.2377c0-1.2567-.577-2.0038-1.902-2.0038-1.222,0-1.834.7811-2.072,1.9019l-5.0939-.3397c.4755-3.3283,2.9549-5.6377,7.5059-5.6377c4.007,0,6.962,1.7321,6.962,5.9434Zm9.25,2.1736v7.4378h-5.502v-15.1473h5.502v2.2755c.815-1.6642,2.615-2.683,4.89-2.683c4.144,0,5.468,2.8868,5.468,6.0453v9.5095h-5.502v-8.0491c0-2.0717-.577-3.1585-2.241-3.1585-1.868,0-2.615,1.4943-2.615,3.7698Zm21.933,1.1208v-.2378l-2.242.4076c-1.324.2717-2.105.6792-2.105,1.6641c0,.7812.611,1.2906,1.528,1.2906c1.562,0,2.819-1.1547,2.819-3.1245Zm5.4-3.2944v5.1623c0,.7811.339,1.1208.917,1.1208.441,0,.781-.068,1.222-.2378v2.9208c-.781.5434-1.868.9849-3.43.9849-1.868,0-3.328-.9509-3.838-2.683-.883,1.766-2.615,2.683-5.026,2.683-2.955,0-4.891-1.5283-4.891-4.1094c0-2.9208,2.106-4.1774,5.4-4.7548l4.246-.7132v-.2377c0-1.2567-.578-2.0038-1.902-2.0038-1.223,0-1.834.7811-2.072,1.9019l-5.094-.3397c.475-3.3283,2.954-5.6377,7.505-5.6377c4.008,0,6.963,1.7321,6.963,5.9434Z'
          transform='translate(0-5)'
          fill='#deceff'
        />
      </svg>
    </div>
  )
}
