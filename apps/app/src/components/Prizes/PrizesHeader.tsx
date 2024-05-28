import { useLargestGrandPrize } from '@generationsoftware/hyperstructure-react-hooks'
import { TokenAmount, TokenValue } from '@shared/react-components'
import { Spinner } from '@shared/ui'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useSupportedPrizePools } from '@hooks/useSupportedPrizePools'

export const PrizesHeader = () => {
  const t = useTranslations('Prizes')

  const prizePools = useSupportedPrizePools()
  const prizePoolsArray = Object.values(prizePools)

  const { data: gpData } = useLargestGrandPrize(prizePoolsArray, { useCurrentPrizeSizes: true })

  const GrandPrizeValue = () =>
    !!gpData ? (
      <span className='ml-2 text-pt-teal'>
        <TokenValue
          token={gpData.token}
          hideZeroes={true}
          countUp={true}
          fallback={<TokenAmount token={gpData.token} hideZeroes={true} />}
        />
      </span>
    ) : (
      <Spinner />
    )

  return (
    <>
      <div className='flex flex-col items-center gap-3'>
        <Image
          src='/partyPopperEmoji.svg'
          alt='Cabana Party Popper Emoji'
          width={88}
          height={88}
          priority={true}
        />
        <span
          className={classNames(
            'w-2/3 flex flex-wrap justify-center text-center text-[1.75rem] font-grotesk font-bold',
            'md:w-full md:text-4xl lg:text-5xl'
          )}
        >
          {t.rich('winUpTo', { amount: () => <GrandPrizeValue /> })}
        </span>
        {/* TODO: add animated text with recent big winners (need luck script/calc) */}
      </div>
    </>
  )
}
