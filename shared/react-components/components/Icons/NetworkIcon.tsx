import { BasicIcon } from '@shared/ui'
import { NETWORK } from '@shared/utilities'
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

  return <BasicIcon content='?' className={className} />
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

const AvalancheIcon = (props: { className?: string }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 1503 1504'
    fill='none'
    className={props.className}
  >
    <rect x='287' y='258' width='928' height='844' fill='white' />
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M1502.5 752C1502.5 1166.77 1166.27 1503 751.5 1503C336.734 1503 0.5 1166.77 0.5 752C0.5 337.234 336.734 1 751.5 1C1166.27 1 1502.5 337.234 1502.5 752ZM538.688 1050.86H392.94C362.314 1050.86 347.186 1050.86 337.962 1044.96C327.999 1038.5 321.911 1027.8 321.173 1015.99C320.619 1005.11 328.184 991.822 343.312 965.255L703.182 330.935C718.495 303.999 726.243 290.531 736.021 285.55C746.537 280.2 759.083 280.2 769.599 285.55C779.377 290.531 787.126 303.999 802.438 330.935L876.42 460.079L876.797 460.738C893.336 489.635 901.723 504.289 905.385 519.669C909.443 536.458 909.443 554.169 905.385 570.958C901.695 586.455 893.393 601.215 876.604 630.549L687.573 964.702L687.084 965.558C670.436 994.693 661.999 1009.46 650.306 1020.6C637.576 1032.78 622.263 1041.63 605.474 1046.62C590.161 1050.86 573.004 1050.86 538.688 1050.86ZM906.75 1050.86H1115.59C1146.4 1050.86 1161.9 1050.86 1171.13 1044.78C1181.09 1038.32 1187.36 1027.43 1187.92 1015.63C1188.45 1005.1 1181.05 992.33 1166.55 967.307C1166.05 966.455 1165.55 965.588 1165.04 964.706L1060.43 785.75L1059.24 783.735C1044.54 758.877 1037.12 746.324 1027.59 741.472C1017.08 736.121 1004.71 736.121 994.199 741.472C984.605 746.453 976.857 759.552 961.544 785.934L857.306 964.891L856.949 965.507C841.69 991.847 834.064 1005.01 834.614 1015.81C835.352 1027.62 841.44 1038.5 851.402 1044.96C860.443 1050.86 875.94 1050.86 906.75 1050.86Z'
      fill='#E84142'
    />
  </svg>
)

const CeloIcon = (props: { className?: string }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 950 950'
    fill='none'
    className={props.className}
  >
    <path
      fill='#FBCC5C'
      d='M375,850c151.9,0,275-123.1,275-275S526.9,300,375,300S100,423.1,100,575S223.1,850,375,850z
  M375,950C167.9,950,0,782.1,0,575s167.9-375,375-375s375,167.9,375,375S582.1,950,375,950z'
    />
    <path
      fill='#35D07F'
      d='M575,650c151.9,0,275-123.1,275-275S726.9,100,575,100S300,223.1,300,375S423.1,650,575,650z
  M575,750c-207.1,0-375-167.9-375-375S367.9,0,575,0s375,167.9,375,375S782.1,750,575,750z'
    />
    <path
      fill='#5EA33B'
      d='M587.4,750c26-31.5,44.6-68.4,54.5-108.1c39.6-9.9,76.5-28.5,108.1-54.5
 c-1.4,45.9-11.3,91.1-29.2,133.5C678.5,738.7,633.3,748.6,587.4,750z M308.1,308.1c-39.6,9.9-76.5,28.5-108.1,54.5
 c1.4-45.9,11.3-91.1,29.2-133.4c42.3-17.8,87.6-27.7,133.4-29.2C336.6,231.5,318,268.4,308.1,308.1z'
    />
  </svg>
)

const BaseIcon = (props: { className?: string }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    fill='none'
    className={props.className}
  >
    <g clipPath='url(#base-icon-clip-path)'>
      <path
        d='M12 23C14.1756 23 16.3023 22.3548 18.1113 21.1462C19.9202 19.9375 21.3301 18.2195 22.1627 16.2095C22.9953 14.1995 23.2131 11.9878 22.7887 9.85404C22.3642 7.72022 21.3165 5.76021 19.7782 4.22183C18.2398 2.68345 16.2798 1.6358 14.146 1.21137C12.0122 0.786929 9.80048 1.00477 7.79048 1.83733C5.7805 2.6699 4.06253 4.07979 2.85384 5.88873C1.64514 7.69767 1 9.82441 1 12C1 14.9174 2.15893 17.7153 4.22182 19.7782C6.28472 21.8411 9.08259 23 12 23Z'
        fill='#0052FF'
      />
      <path
        d='M11.9742 19.7465C16.2524 19.7465 19.7206 16.2783 19.7206 12C19.7206 7.72176 16.2524 4.25354 11.9742 4.25354C7.91543 4.25354 4.58574 7.37493 4.25469 11.3481H15.7499V12.6381H4.25354C4.57799 16.6179 7.91068 19.7465 11.9742 19.7465Z'
        fill='white'
      />
    </g>
    <defs>
      <clipPath id='base-icon-clip-path'>
        <rect width='22' height='22' fill='white' transform='translate(1 1)' />
      </clipPath>
    </defs>
  </svg>
)

const ScrollIcon = (props: { className?: string }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 444 444'
    xmlSpace='preserve'
    className={props.className}
  >
    <g>
      <rect width='444' height='444' fill='#FFEEDA' />
      <g>
        <path
          d='M333.4,262V110.6c-0.2-12.7-10.3-22.9-23-22.9h-158c-34.1,0.5-61.5,28.4-61.5,62.6c0,11.5,3.1,21.4,7.8,30.1
			c4,7.2,10.3,14,16.5,19.1c1.8,1.4,0.9,0.8,6.3,4.1c7.4,4.5,15.9,6.8,15.9,6.8l-0.1,90.6c0.2,4.3,0.6,8.4,1.8,12.3
			c3.5,12.8,12.4,22.6,24.4,27.3c5,2,10.7,3.3,16.8,3.4l126.2,0.4c25.1,0,45.5-20.4,45.5-45.6C352.1,283.8,344.6,270.4,333.4,262z'
          fill='#FFEEDA'
        />
        <path
          d='M336.5,299.9C336,316,322.7,329,306.4,329l-86.8-0.3c6.9-8,11.1-18.4,11.1-29.8c0-17.8-10.6-30.1-10.6-30.1
			h86.4c16.6,0,30.1,13.5,30.1,30.1L336.5,299.9z'
          fill='#EBC28E'
        />
        <path
          d='M123.5,186.7c-10-9.5-17-21.7-17-36.3v-1.5c0.8-24.8,21.2-44.8,46-45.5h158c4.1,0.2,7.4,3.1,7.4,7.3v133.7
			c3.6,0.6,5.4,1.1,8.9,2.4c2.8,1,6.6,3.2,6.6,3.2V110.7c-0.2-12.7-10.3-22.9-23-22.9h-158c-34.1,0.5-61.5,28.4-61.5,62.6
			c0,19.9,9.1,36.9,23.9,48.8c1,0.8,2,1.9,4.6,1.9c4.6,0,7.9-3.7,7.7-7.7C127.1,190,125.6,188.8,123.5,186.7z'
          fill='#101010'
        />
        <path
          d='M306.4,253.2H182.5c-8.3,0.1-15,6.8-15,15.1v17.8c0.2,8.2,7.2,15.2,15.6,15.2h9.2v-15.2H183v-17.4
			c0,0,2.3,0,5,0c15.7,0,27.2,14.5,27.2,30.1c0,13.8-12.6,31.4-33.6,30c-18.6-1.2-28.7-17.8-28.7-30v-151c0-6.8-5.6-12.4-12.4-12.4
			h-12.4v15.5h9.2v148c-0.5,30.1,21.4,45.2,44.3,45.2l124.9,0.4c25.1,0,45.5-20.4,45.5-45.6C352.1,273.7,331.6,253.2,306.4,253.2z
			 M336.5,299.9C336,316,322.7,329,306.4,329l-86.8-0.3c6.9-8,11.1-18.4,11.1-29.8c0-17.8-10.6-30.1-10.6-30.1h86.4
			c16.6,0,30.1,13.5,30.1,30.1L336.5,299.9z'
          fill='#101010'
        />
        <path
          d='M273,153.7h-93.4v-15.5H273c4.2,0,7.7,3.4,7.7,7.7C280.8,150.2,277.4,153.7,273,153.7z'
          fill='#101010'
        />
        <path
          d='M273,226.4h-93.4V211H273c4.2,0,7.7,3.4,7.7,7.7C280.8,222.9,277.4,226.4,273,226.4z'
          fill='#101010'
        />
        <path
          d='M289.5,190H179.6v-15.5h109.8c4.2,0,7.7,3.4,7.7,7.7C297.3,186.5,293.8,190,289.5,190z'
          fill='#101010'
        />
      </g>
    </g>
  </svg>
)

const GnosisIcon = (props: { className?: string }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 75 75'
    fill='none'
    className={props.className}
  >
    <g clipPath='url(#clip0_2909_1369)'>
      <path
        d='M12.32 33.08C12.2859 30.9109 12.9912 28.7948 14.32 27.08L27.96 40.72C26.2408 42.0404 24.1277 42.7447 21.96 42.72C19.4066 42.7095 16.9608 41.6905 15.1552 39.8849C13.3496 38.0793 12.3306 35.6335 12.32 33.08Z'
        fill='#133629'
      />
      <path
        d='M52.9 42.71C54.1771 42.7153 55.4426 42.4678 56.6237 41.9818C57.8047 41.4958 58.8778 40.781 59.7813 39.8784C60.6848 38.9758 61.4008 37.9034 61.888 36.7229C62.3752 35.5423 62.624 34.2771 62.62 33C62.6439 30.8325 61.9396 28.7197 60.62 27L46.94 40.68C48.6405 42.0102 50.7411 42.7257 52.9 42.71Z'
        fill='#133629'
      />
      <path
        d='M63.4499 24.23C65.5528 26.6994 66.7084 29.8366 66.7099 33.08C66.7073 36.7277 65.2564 40.225 62.6762 42.8034C60.096 45.3817 56.5976 46.83 52.9499 46.83C49.7234 46.8337 46.5994 45.6967 44.1299 43.62L37.5099 50.24L30.8899 43.62C28.4187 45.7004 25.2902 46.8377 22.0599 46.83C20.2496 46.8366 18.4557 46.4859 16.7812 45.798C15.1066 45.11 13.5843 44.0984 12.3014 42.8211C11.0185 41.5437 10.0002 40.0258 9.30496 38.3543C8.60975 36.6827 8.25121 34.8904 8.24991 33.08C8.25249 29.8515 9.38859 26.7265 11.4599 24.25L8.3699 21.16L5.41995 18.16C1.86631 24.0027 -0.00901661 30.7115 -9.03528e-05 37.55C-0.00140495 42.4653 0.96596 47.3327 2.84665 51.8739C4.72734 56.4152 7.48451 60.5413 10.9606 64.0164C14.4367 67.4916 18.5636 70.2477 23.1053 72.1272C27.6471 74.0066 32.5146 74.9727 37.4299 74.97C47.3492 74.9674 56.8621 71.0285 63.8799 64.0183C70.8977 57.008 74.8467 47.4993 74.86 37.58C74.9217 30.7426 73.0646 24.025 69.4999 18.19L63.4499 24.23Z'
        fill='#133629'
      />
      <path
        d='M64.54 11.74C61.0496 8.07017 56.8486 5.14916 52.1931 3.1549C47.5375 1.16065 42.5247 0.134865 37.46 0.140034C32.3942 0.137583 27.3808 1.16455 22.724 3.1586C18.0672 5.15266 13.8641 8.07221 10.37 11.74C9.46 12.74 8.57005 13.74 7.74005 14.81L37.43 44.49L67.12 14.78C66.3361 13.7045 65.4738 12.6884 64.54 11.74ZM37.46 37.56L14.46 14.56C17.4671 11.5209 21.0501 9.11181 24.9993 7.47375C28.9485 5.8357 33.1846 5.00153 37.46 5.02004C41.7362 4.99649 45.9738 5.82835 49.9237 7.46669C53.8736 9.10504 57.456 11.5168 60.46 14.56L37.46 37.56Z'
        fill='#133629'
      />
    </g>
    <defs>
      <clipPath id='clip0_2909_1369'>
        <rect width='74.86' height='74.86' fill='white' transform='translate(0 0.140015)' />
      </clipPath>
    </defs>
  </svg>
)

/* ================================ Icon Mapping ================================ */

const icons = {
  [NETWORK.mainnet]: { svgIcon: EthereumIcon, iconBgColor: '#484c50' },
  [NETWORK.sepolia]: { svgIcon: EthereumIcon, iconBgColor: '#484c50' },
  [NETWORK.polygon]: { svgIcon: PolygonIcon, iconBgColor: '#9f71ec' },
  [NETWORK.mumbai]: { svgIcon: PolygonIcon, iconBgColor: '#9f71ec' },
  [NETWORK.optimism]: { svgIcon: OptimismIcon, iconBgColor: '#ff5a57' },
  [NETWORK.optimism_sepolia]: { svgIcon: OptimismIcon, iconBgColor: '#ff5a57' },
  [NETWORK.arbitrum]: { svgIcon: ArbitrumIcon, iconBgColor: '#96bedc' },
  [NETWORK.arbitrum_sepolia]: { svgIcon: ArbitrumIcon, iconBgColor: '#96bedc' },
  [NETWORK.avalanche]: { svgIcon: AvalancheIcon, iconBgColor: '#e84142' },
  [NETWORK.fuji]: { svgIcon: AvalancheIcon, iconBgColor: '#e84142' },
  [NETWORK.celo]: { svgIcon: CeloIcon, iconBgColor: '#ffffff' },
  [NETWORK.celo_testnet]: { svgIcon: CeloIcon, iconBgColor: '#ffffff' },
  [NETWORK.base]: { svgIcon: BaseIcon, iconBgColor: '#0052FF' },
  [NETWORK.base_sepolia]: { svgIcon: BaseIcon, iconBgColor: '#0052FF' },
  [NETWORK.scroll]: { svgIcon: ScrollIcon, iconBgColor: '#ffeeda' },
  [NETWORK.scroll_sepolia]: { svgIcon: ScrollIcon, iconBgColor: '#ffeeda' },
  [NETWORK.gnosis]: { svgIcon: GnosisIcon, iconBgColor: '#f0ebde' },
  [NETWORK.gnosis_chiado]: { svgIcon: GnosisIcon, iconBgColor: '#f0ebde' }
}
