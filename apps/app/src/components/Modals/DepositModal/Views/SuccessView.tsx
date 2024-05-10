import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { useVaultTokenData } from '@generationsoftware/hyperstructure-react-hooks'
import { PrizePoolBadge, SocialShareButton, SuccessPooly } from '@shared/react-components'
import { ExternalLink } from '@shared/ui'
import {
  formatNumberForDisplay,
  getBlockExplorerName,
  getBlockExplorerUrl,
  getNiceNetworkNameByChainId
} from '@shared/utilities'
import { useAtomValue } from 'jotai'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { depositFormTokenAmountAtom } from '../DepositForm'

interface SuccessViewProps {
  vault: Vault
  txHash?: string
}

export const SuccessView = (props: SuccessViewProps) => {
  const { vault, txHash } = props

  const t_common = useTranslations('Common')
  const t_modals = useTranslations('TxModals')

  const formTokenAmount = useAtomValue(depositFormTokenAmountAtom)

  const { data: tokenData } = useVaultTokenData(vault)

  const tokens = `${formatNumberForDisplay(formTokenAmount)} ${tokenData?.symbol}`
  const name = getBlockExplorerName(vault.chainId)

  return (
    <div className='flex flex-col gap-6 items-center'>
      <div className='flex flex-col gap-3 items-center'>
        <div className='flex flex-col items-center text-lg font-medium text-center'>
          <span className='text-pt-teal'>{t_modals('success')}</span>
          <span>{t_modals('deposited', { tokens })}</span>
        </div>
        <PrizePoolBadge
          chainId={vault.chainId}
          hideBorder={true}
          intl={t_common}
          className='!py-1'
        />
        <SuccessPooly className='w-40 h-auto mt-3' />
      </div>
      <span className='text-sm text-center md:text-base'>{t_modals('nowEligible')}</span>
      {!!txHash && (
        <ExternalLink
          href={getBlockExplorerUrl(vault.chainId, txHash, 'tx')}
          size='sm'
          className='text-pt-teal'
        >
          {t_common('viewOn', { name })}
        </ExternalLink>
      )}
      <ShareButtons vault={vault} />
    </div>
  )
}

interface ShareButtonsProps {
  vault: Vault
}

const ShareButtons = (props: ShareButtonsProps) => {
  const { vault } = props

  const t = useTranslations('TxModals')

  const { data: tokenData } = useVaultTokenData(vault)

  const network = getNiceNetworkNameByChainId(vault.chainId)
  const hashTags = ['PoolTogether', network]

  const text = useMemo(() => {
    if (!!tokenData) {
      return {
        twitter: getShareText(tokenData.symbol, 'twitter'),
        warpcast: getShareText(tokenData.symbol, 'warpcast'),
        hey: getShareText(tokenData.symbol, 'hey')
      }
    } else {
      return {}
    }
  }, [tokenData])

  return (
    <div className='flex flex-col items-center'>
      <h1 className='py-1 text-sm sm:text-md font-medium'>{t('shareOn')}:</h1>
      <div className='flex flex-col sm:flex-row gap-2'>
        <SocialShareButton platform='twitter' text={text.twitter} hashTags={hashTags} />
        <SocialShareButton platform='warpcast' text={text.warpcast} />
        <SocialShareButton platform='hey' text={text.hey} hashTags={hashTags} />
      </div>
    </div>
  )
}

type SharePlatform = 'twitter' | 'warpcast' | 'hey'

const getShareText = (tokenSymbol: string, platform: SharePlatform) => {
  const protocolAccounts: Record<SharePlatform, string> = {
    twitter: '@PoolTogether_',
    warpcast: 'PoolTogether',
    hey: '@pooltogether'
  }

  const pooltogether = protocolAccounts[platform]
  const token = `$${tokenSymbol}`

  const textOptions: string[] = [
    `⚡️ Injecting some excitement into my savings strategy with ${pooltogether}! Just made my deposit - watch out for my victory dance when I scoop up that grand prize. 🏆`,
    `🎉 Just joined the thrill ride of decentralized savings! I've deposited into ${pooltogether}, crossing my fingers for that sweet grand prize win. 🤞🏆💰`,
    `Just added some ${token} to the ${pooltogether} mix! Excited to be part of a no-loss savings game. Who knows, maybe I'll be the next lucky winner! 🤞💸`,
    `🎉 Joined the ${pooltogether} community by depositing ${token} today! Let's see if my luck will land me that grand prize. 🏆🚀`,
    `Tossed my ${token} into the ${pooltogether} mix! Who else is crossing their fingers for a no-loss win?`,
    `Just added some ${token} to the ${pooltogether} party! 🎉 Let's ride this wave together! 🌊💸`,
    `🚂 Deposited ${token} into ${pooltogether} and I'm excited to see where this ride takes me. Could a cool win be in my future? 🎆💰`
  ]

  const pseudoRandomIndex = Math.floor(Math.random() * textOptions.length)

  return textOptions[pseudoRandomIndex]
}
