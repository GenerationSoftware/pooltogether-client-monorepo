import { NETWORK } from '@pooltogether/hyperstructure-client-js'
import { BasicIcon } from '@shared/ui'
import classNames from 'classnames'

export interface NetworkIconProps {
  chainId: number
  className?: string
}

export const NetworkIcon = (props: NetworkIconProps) => {
  const { chainId, className } = props

  if (chainId in icons) {
    const SvgIcon = icons[chainId as keyof typeof icons].svgIcon
    return <SvgIcon className={classNames('rounded-full', className)} />
  }

  return <BasicIcon content='?' />
}

/* =================================== Icons =================================== */

const EthereumIcon = (props: { className?: string }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 25 25'
    fill='none'
    className={props.className}
  >
    <g clipPath='url(#clip0_1136_2204)'>
      <path
        d='M12.5 24.5C19.1274 24.5 24.5 19.1274 24.5 12.5C24.5 5.87258 19.1274 0.5 12.5 0.5C5.87258 0.5 0.5 5.87258 0.5 12.5C0.5 19.1274 5.87258 24.5 12.5 24.5Z'
        fill='#627EEA'
      />
      <path d='M12.873 3.5V10.1525L18.4958 12.665L12.873 3.5Z' fill='white' fillOpacity='0.602' />
      <path d='M12.8735 3.5L7.25 12.665L12.8735 10.1525V3.5Z' fill='white' />
      <path
        d='M12.873 16.9759V21.4962L18.4995 13.7119L12.873 16.9759Z'
        fill='white'
        fillOpacity='0.602'
      />
      <path d='M12.8735 21.4962V16.9752L7.25 13.7119L12.8735 21.4962Z' fill='white' />
      <path
        d='M12.873 15.93L18.4958 12.6653L12.873 10.1543V15.93Z'
        fill='white'
        fillOpacity='0.2'
      />
      <path
        d='M7.25 12.6653L12.8735 15.93V10.1543L7.25 12.6653Z'
        fill='white'
        fillOpacity='0.602'
      />
    </g>
    <defs>
      <clipPath id='clip0_1136_2204'>
        <rect width='24' height='24' fill='white' transform='translate(0.5 0.5)' />
      </clipPath>
    </defs>
  </svg>
)

const PolygonIcon = (props: { className?: string }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 28 28'
    fill='none'
    className={props.className}
  >
    <rect width='28' height='28' fill='#8247E5' rx='14' />
    <rect width='28' height='28' fill='url(#a)' fillOpacity='.3' rx='14' />
    <path
      fill='#fff'
      d='M18.28 10.92a1.06 1.06 0 0 0-1.06 0l-2.41 1.42-1.65.93-2.41 1.43c-.31.19-.72.19-1.06 0l-1.92-1.12a1.07 1.07 0 0 1-.53-.9v-2.2a1 1 0 0 1 .53-.9l1.9-1.08c.3-.18.7-.18 1.04 0l1.9 1.09c.3.18.52.52.52.9v1.42l1.64-.96V9.52a1 1 0 0 0-.52-.9l-3.5-2.04a1.06 1.06 0 0 0-1.06 0L6.13 8.63a1 1 0 0 0-.53.9v4.12a1 1 0 0 0 .53.9l3.56 2.04c.31.19.71.19 1.06 0l2.41-1.4 1.65-.95 2.41-1.4c.31-.19.72-.19 1.06 0l1.89 1.09c.3.18.53.52.53.9v2.2a1 1 0 0 1-.53.9l-1.9 1.11c-.3.19-.7.19-1.05 0l-1.89-1.08a1.07 1.07 0 0 1-.52-.9v-1.43l-1.65.96v1.43a1 1 0 0 0 .53.9l3.56 2.04c.31.19.72.19 1.06 0l3.56-2.04c.31-.19.53-.53.53-.9v-4.13a1 1 0 0 0-.53-.9l-3.6-2.07Z'
    />
    <defs>
      <linearGradient id='a' x1='0' x2='14' y1='0' y2='28' gradientUnits='userSpaceOnUse'>
        <stop stopColor='#fff' />
        <stop offset='1' stopColor='#fff' stopOpacity='0' />
      </linearGradient>
    </defs>
  </svg>
)

const OptimismIcon = (props: { className?: string }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 28 28'
    fill='none'
    className={props.className}
  >
    <rect width='28' height='28' fill='#FF3131' rx='14' />
    <rect width='28' height='28' fill='url(#a)' fillOpacity='.3' rx='14' />
    <path
      fill='#fff'
      d='M9.22 18.35c2.7 0 4.86-2.2 4.86-5.38 0-2.19-1.47-3.8-3.98-3.8-2.72 0-4.85 2.2-4.85 5.38 0 2.2 1.5 3.8 3.97 3.8Zm.83-7.35c1.06 0 1.74.81 1.74 2.1 0 1.9-1.11 3.42-2.51 3.42-1.06 0-1.74-.82-1.74-2.1 0-1.89 1.11-3.42 2.5-3.42Zm6.38-1.68-1.88 8.88h2.26l.55-2.6h1.47c2.43 0 4.01-1.38 4.01-3.6 0-1.61-1.17-2.68-3.1-2.68h-3.3Zm1.9 1.74h.94c.83 0 1.3.38 1.3 1.14 0 1-.68 1.7-1.74 1.7h-1.11l.6-2.84Z'
    />
    <defs>
      <linearGradient id='a' x1='0' x2='14' y1='0' y2='28' gradientUnits='userSpaceOnUse'>
        <stop stopColor='#fff' />
        <stop offset='1' stopColor='#fff' stopOpacity='0' />
      </linearGradient>
    </defs>
  </svg>
)

const ArbitrumIcon = (props: { className?: string }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 28 28'
    fill='none'
    className={props.className}
  >
    <rect
      width='26.6'
      height='26.6'
      x='.7'
      y='.7'
      fill='#2D374B'
      stroke='#96BEDC'
      strokeWidth='1.4'
      rx='13.3'
    />
    <mask
      id='a'
      width='28'
      height='28'
      x='0'
      y='0'
      maskUnits='userSpaceOnUse'
      style={{ maskType: 'alpha' }}
    >
      <rect width='28' height='28' fill='#C4C4C4' rx='14' />
    </mask>
    <g mask='url(#a)'>
      <path
        fill='#28A0F0'
        d='m14.0861 18.6041 6.5014 10.2239 4.0057-2.3213-7.86-12.3943-2.6471 4.4917Zm13.0744 3.4692-.003-1.8599-7.3064-11.407-2.3087 3.9173 7.091 11.4303 2.172-1.2586a.9628.9628 0 0 0 .3555-.7009l-.0004-.1212Z'
      />
      <rect
        width='25.9'
        height='25.9'
        x='1.05'
        y='1.05'
        fill='url(#b)'
        fillOpacity='.3'
        stroke='#96BEDC'
        strokeWidth='2.1'
        rx='12.95'
      />
      <path
        fill='#fff'
        d='m.3634 28.2207-3.07-1.7674-.234-.8333L7.7461 9.0194c.7298-1.1913 2.3197-1.575 3.7957-1.5541l1.7323.0457L.3634 28.2207ZM19.1655 7.511l-4.5653.0166L2.24 27.9533l3.6103 2.0788.9818-1.6652L19.1655 7.511Z'
      />
    </g>
    <defs>
      <linearGradient id='b' x1='0' x2='14' y1='0' y2='28' gradientUnits='userSpaceOnUse'>
        <stop stopColor='#fff' />
        <stop offset='1' stopColor='#fff' stopOpacity='0' />
      </linearGradient>
    </defs>
  </svg>
)

/* ================================ Icon Mapping ================================ */

const icons = Object.freeze({
  [NETWORK.mainnet]: { svgIcon: EthereumIcon, iconBgColor: '#484c50' },
  [NETWORK.goerli]: { svgIcon: EthereumIcon, iconBgColor: '#484c50' },
  [NETWORK.sepolia]: { svgIcon: EthereumIcon, iconBgColor: '#484c50' },
  [NETWORK.polygon]: { svgIcon: PolygonIcon, iconBgColor: '#9f71ec' },
  [NETWORK.mumbai]: { svgIcon: PolygonIcon, iconBgColor: '#9f71ec' },
  [NETWORK.optimism]: { svgIcon: OptimismIcon, iconBgColor: '#ff5a57' },
  [NETWORK['optimism-goerli']]: { svgIcon: OptimismIcon, iconBgColor: '#ff5a57' },
  [NETWORK.arbitrum]: { svgIcon: ArbitrumIcon, iconBgColor: '#96bedc' },
  [NETWORK['arbitrum-goerli']]: { svgIcon: ArbitrumIcon, iconBgColor: '#96bedc' }
})
