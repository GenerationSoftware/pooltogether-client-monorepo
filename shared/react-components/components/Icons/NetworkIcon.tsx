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
    viewBox='0 0 600 600'
    fill='none'
    className={props.className}
  >
    <ellipse cx='300' cy='300' rx='300' ry='299' fill='white' />
    <path
      d='M524.951 158.188L504.5 178.64C520.755 204.204 525.868 236.271 514.725 266.92C496.136 318.966 438.532 346.393 386.014 327.803C378.567 325.024 371.62 321.773 365.562 317.577L300.039 383.1L242.881 325.469C216.399 343.114 182.471 348.227 150.404 337.084C96.4964 317.577 68.6256 258.556 88.1324 205.121C90.9111 196.757 95.107 189.31 99.7475 182.363L75.1279 157.744L70.4874 165.635C44.9229 207.455 31.0014 255.778 31.0014 305.489C30.529 453.708 151.349 575 299.567 575H300.039C448.258 575 568.633 454.652 569.078 306.406C569.078 257.139 555.601 208.817 530.036 166.552L524.951 158.188Z'
      fill='#00A6C4'
    />
    <path
      d='M129.98 212.568C123.006 221.849 118.837 233.492 118.837 246.024C118.837 276.229 143.457 300.849 173.662 300.849C186.222 300.849 197.837 296.653 207.118 289.234L129.98 212.568ZM399.018 284.565C407.855 290.595 418.081 293.846 429.696 293.846C459.901 293.846 484.52 269.227 484.52 239.022C484.52 227.879 481.269 217.181 475.239 208.344L399.018 284.565ZM300.956 351.779L78.8513 134.233L87.6877 124.652C142.512 66.5758 217.316 25 297.705 25H298.178C379.484 25 457.567 64.2416 511.919 124.652L520.283 134.233L300.956 351.779ZM115.114 131.603L300.984 315.071L484.52 131.598C435.253 82.3591 368.341 51.0091 298.65 51.0091H298.178C228.931 51.0091 164.353 83.7532 115.114 131.603Z'
      fill='#00A6C4'
    />
  </svg>
)

const WorldIcon = (props: { className?: string }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 620 620'
    fill='none'
    className={props.className}
  >
    <circle cx='310' cy='310' r='306' fill='white' />
    <g clipPath='url(#clip0_34_27)'>
      <mask
        id='mask0_34_27'
        style={{ maskType: 'luminance' }}
        maskUnits='userSpaceOnUse'
        x='-57'
        y='-57'
        width='734'
        height='734'
      >
        <path d='M676.837 -56.6019H-56.3662V676.602H676.837V-56.6019Z' fill='white' />
      </mask>
      <g mask='url(#mask0_34_27)'>
        <mask
          id='mask1_34_27'
          style={{ maskType: 'luminance' }}
          maskUnits='userSpaceOnUse'
          x='-669'
          y='-670'
          width='1959'
          height='1960'
        >
          <path d='M-668.866 -669.293H1289.72V1289.29H-668.866V-669.293Z' fill='white' />
        </mask>
        <g mask='url(#mask1_34_27)'>
          <path
            d='M521.818 181.168L307.505 181.507C236.542 181.507 179.011 239.037 179.011 310C179.011 380.963 236.542 438.493 307.505 438.493H513.883'
            stroke='black'
            strokeWidth='50'
            strokeMiterlimit='10'
            strokeLinecap='round'
          />
          <path
            d='M64.1763 310H559.225'
            stroke='black'
            strokeWidth='50'
            strokeMiterlimit='10'
            strokeLinecap='round'
          />
          <path
            d='M310 60.7753C447.643 60.7753 559.225 172.357 559.225 310C559.225 447.643 447.643 559.225 310 559.225C172.357 559.225 60.7754 447.643 60.7754 310C60.7754 172.357 172.357 60.7753 310 60.7753Z'
            stroke='black'
            strokeWidth='50'
            strokeMiterlimit='10'
            strokeLinecap='round'
          />
        </g>
      </g>
    </g>
    <defs>
      <clipPath id='clip0_34_27'>
        <rect width='550' height='550' fill='white' transform='translate(35 35)' />
      </clipPath>
    </defs>
  </svg>
)

/* ================================ Icon Mapping ================================ */

const icons: Record<
  NETWORK,
  { svgIcon: (props: { className?: string }) => JSX.Element; iconBgColor: `#${string}` }
> = {
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
  [NETWORK.gnosis_chiado]: { svgIcon: GnosisIcon, iconBgColor: '#f0ebde' },
  [NETWORK.world]: { svgIcon: WorldIcon, iconBgColor: '#ffffff' },
  [NETWORK.world_sepolia]: { svgIcon: WorldIcon, iconBgColor: '#ffffff' }
}
