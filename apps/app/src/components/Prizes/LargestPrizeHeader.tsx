import {
  useCachedVaultLists,
  useLargestGrandPrize
} from '@generationsoftware/hyperstructure-react-hooks'
import { TokenAmount, TokenIcon, TokenValue } from '@shared/react-components'
import { Spinner } from '@shared/ui'
import { isTestnet, lower, NETWORK, sToMs } from '@shared/utilities'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useState } from 'react'
import { Address } from 'viem'
import { useSupportedPrizePools } from '@hooks/useSupportedPrizePools'

export const LargestPrizeHeader = () => {
  const t = useTranslations('Home')

  const prizePools = useSupportedPrizePools()
  const prizePoolsArray = Object.values(prizePools)

  const { data: gpData } = useLargestGrandPrize(prizePoolsArray, { useCurrentPrizeSizes: true })

  const GrandPrizeValue = () =>
    !!gpData ? (
      <TokenValue
        token={gpData.token}
        hideZeroes={true}
        countUp={true}
        fallback={<TokenAmount token={gpData.token} hideZeroes={true} />}
      />
    ) : (
      <Spinner />
    )

  return (
    <>
      <div className='flex flex-col items-center gap-3'>
        <span
          className={classNames(
            'w-2/3 justify-center text-center text-[1.75rem] font-grotesk font-medium',
            'min-[400px]:flex min-[400px]:whitespace-nowrap',
            'md:w-full md:text-4xl lg:text-5xl'
          )}
        >
          {t.rich('winUpTo', {
            token: () => <TokenFlipper className='hidden my-auto mx-2 min-[400px]:block' />,
            amount: () => <GrandPrizeValue />
          })}
        </span>
        <span className='text-center text-pt-purple-100'>{t('withdrawAnyTime')}</span>
      </div>
    </>
  )
}

// TODO: flip animations not working
const TokenFlipper = (props: { className?: string }) => {
  const { className } = props

  const { cachedVaultLists } = useCachedVaultLists()
  const defaultVaultList = cachedVaultLists['default']

  const tokens = useMemo(() => {
    const vaultTokens: { chainId: number; address: Address }[] = []
    const ignoreList: { [chainId: number]: Lowercase<Address>[] } = {
      [NETWORK.optimism]: [
        '0xdb1fe6da83698885104da02a6e0b3b65c0b0de80',
        '0x6da98bde0068d10ddd11b468b197ea97d96f96bc'
      ]
    }

    if (!!defaultVaultList) {
      defaultVaultList.tokens.forEach((vaultInfo) => {
        const tokenAddress = vaultInfo.extensions?.underlyingAsset?.address

        if (
          !isTestnet(vaultInfo.chainId) &&
          !!tokenAddress &&
          !ignoreList[vaultInfo.chainId]?.includes(lower(tokenAddress))
        ) {
          vaultTokens.push({
            chainId: vaultInfo.chainId,
            address: tokenAddress
          })
        }
      })
    }

    return vaultTokens
  }, [defaultVaultList])

  const [tokenIndex, _setTokenIndex] = useState<number>(0)
  // const [isFlipping, setIsFlipping] = useState<boolean>(false)

  const setTokenIndex = (val: number) => {
    if (!tokens.length) return

    if (val >= tokens.length) {
      setTokenIndex(val - tokens.length)
    } else {
      _setTokenIndex(val)
    }
  }

  useEffect(() => {
    let i = 0

    const interval = setInterval(() => {
      setTokenIndex(++i)
    }, sToMs(1))

    return () => clearInterval(interval)
  }, [])

  if (!tokens.length) {
    return <></>
  }

  // const isNextIndex = (i: number) =>
  //   i === tokenIndex + 1 || (i === 0 && tokenIndex === tokens.length - 1)

  return (
    <div className={classNames('w-10 h-10 shrink-0 isolate', className)}>
      {tokens.map((token, i) => (
        <TokenIcon
          key={`${token.chainId}-${token.address}`}
          token={token}
          className={classNames(
            'absolute !w-10 !h-10',
            // 'absolute !w-10 !h-10 [transform:perspective(1000px)] [transform-style:preserve-3d]',
            {
              invisible: i !== tokenIndex
              // 'animate-[flip_0.5s_linear]': isFlipping && i === tokenIndex,
              // 'animate-[unflip_0.5s_linear]': isFlipping && isNextIndex(i)
            }
          )}
          showSpinner={i === tokenIndex}
        />
      ))}
    </div>
  )
}
