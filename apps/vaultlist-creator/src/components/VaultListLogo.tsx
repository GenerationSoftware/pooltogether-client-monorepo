import classNames from 'classnames'
import { useAtomValue } from 'jotai'
import Image from 'next/image'
import { listImageAtom } from 'src/atoms'

interface VaultListLogoProps {
  className?: string
}

export const VaultListLogo = (props: VaultListLogoProps) => {
  const { className } = props

  const rawLogoURI = useAtomValue(listImageAtom)
  const src = getSrc(rawLogoURI)

  if (!src) {
    return <></>
  }

  return (
    <Image
      src={src}
      width={64}
      height={64}
      alt='Vault List Logo'
      className={classNames('w-20 h-20 border-2 border-pt-purple-100 rounded-full', className)}
    />
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
