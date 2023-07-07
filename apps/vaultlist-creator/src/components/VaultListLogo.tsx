import { BasicIcon, Spinner } from '@shared/ui'
import classNames from 'classnames'
import { useAtomValue } from 'jotai'
import { useEffect, useState } from 'react'
import { listImageAtom } from 'src/atoms'

interface VaultListLogoProps {
  className?: string
}

export const VaultListLogo = (props: VaultListLogoProps) => {
  const { className } = props

  const rawLogoURI = useAtomValue(listImageAtom)
  const src = getSrc(rawLogoURI)

  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const [isFallbackLogo, setIsFallbackLogo] = useState<boolean>(false)

  useEffect(() => {
    setIsFallbackLogo(false)
    setIsLoaded(false)
  }, [src])

  if (!src) {
    return <></>
  }

  return (
    <>
      <img
        src={src}
        width={80}
        height={80}
        alt='Vault List Logo'
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsFallbackLogo(true)}
        className={classNames('w-20 h-20 rounded-full', { hidden: !isLoaded }, className)}
      />
      <BasicIcon
        size='xl'
        content={isFallbackLogo ? '?' : <Spinner className='after:border-y-pt-purple-800' />}
        className={classNames({ hidden: isLoaded }, className)}
      />
    </>
  )
}

const getSrc = (rawURI: string) => {
  if (rawURI.startsWith('http://') || rawURI.startsWith('https://')) {
    return rawURI
  } else if (rawURI.startsWith('ipfs://')) {
    return `https://dweb.link/ipfs/${rawURI.slice(7)}`
  } else if (rawURI.startsWith('ipns://')) {
    return `https://dweb.link/ipns/${rawURI.slice(7)}`
  }
}
