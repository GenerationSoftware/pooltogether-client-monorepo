import {
  formatNumberForDisplay,
  getBlockExplorerName,
  getBlockExplorerUrl,
  getNiceNetworkNameByChainId,
  Vault
} from '@pooltogether/hyperstructure-client-js'
import { useVaultTokenData } from '@pooltogether/hyperstructure-react-hooks'
import { Intl } from '@shared/types'
import { Button, ExternalLink, LINKS } from '@shared/ui'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'
import { PrizePoolBadge } from '../../../Badges/PrizePoolBadge'
import { LensterShareButton } from '../../../Buttons/LensterShareButton'
import { TwitterShareButton } from '../../../Buttons/TwitterShareButton'
import { depositFormTokenAmountAtom } from '../../../Form/DepositForm'
import { SuccessPooly } from '../../../Graphics/SuccessPooly'

interface SuccessViewProps {
  vault: Vault
  closeModal: () => void
  txHash?: string
  goToAccount?: () => void
  intl?: {
    base?: Intl<
      'success' | 'deposited' | 'nowEligible' | 'shareTwitter' | 'shareLenster' | 'viewAccount'
    >
    common?: Intl<'prizePool' | 'viewOn'>
  }
}

export const SuccessView = (props: SuccessViewProps) => {
  const { vault, txHash, closeModal, goToAccount, intl } = props

  const formTokenAmount = useAtomValue(depositFormTokenAmountAtom)

  const { data: tokenData } = useVaultTokenData(vault)

  const tokens = `${formatNumberForDisplay(formTokenAmount)} ${tokenData?.symbol}`
  const name = getBlockExplorerName(vault.chainId)

  return (
    <div className='flex flex-col gap-6 items-center'>
      <div className='flex flex-col gap-3 items-center'>
        <div className='flex flex-col items-center text-lg font-medium text-center'>
          <span className='text-pt-teal'>{intl?.base?.('success') ?? 'Success!'}</span>
          <span>{intl?.base?.('deposited', { tokens }) ?? `You deposited ${tokens}`}</span>
        </div>
        <PrizePoolBadge
          chainId={vault.chainId}
          hideBorder={true}
          intl={intl?.common}
          className='!py-1'
        />
        <SuccessPooly className='w-40 h-auto mt-3' />
      </div>
      <span className='text-sm text-center md:text-base'>
        {intl?.base?.('nowEligible') ?? 'You are now eligible for all future draws in this pool.'}
      </span>
      {!!txHash && (
        <ExternalLink
          href={getBlockExplorerUrl(vault.chainId, txHash, 'tx')}
          size='sm'
          className='text-pt-teal'
        >
          {intl?.common?.('viewOn', { name }) ?? `View on ${name}`}
        </ExternalLink>
      )}
      <ShareButtons vault={vault} intl={intl?.base} />
      {!!goToAccount && (
        <Button
          fullSized={true}
          color='transparent'
          onClick={() => {
            goToAccount()
            closeModal()
          }}
        >
          {intl?.base?.('viewAccount') ?? 'View Account'}
        </Button>
      )}
    </div>
  )
}

interface ShareButtonsProps {
  vault: Vault
  intl?: Intl<'shareTwitter' | 'shareLenster'>
}

const ShareButtons = (props: ShareButtonsProps) => {
  const { vault, intl } = props

  const { data: tokenData } = useVaultTokenData(vault)

  const network = getNiceNetworkNameByChainId(vault.chainId)
  const hashTags = ['PoolTogether', network]

  const text = useMemo(() => {
    if (!!tokenData) {
      return {
        twitter: getShareText(tokenData.symbol, 'twitter'),
        lenster: getShareText(tokenData.symbol, 'lenster')
      }
    } else {
      return {}
    }
  }, [tokenData])

  return (
    <>
      <TwitterShareButton
        text={text.twitter}
        hashTags={hashTags}
        url={LINKS.app}
        fullSized={true}
        intl={intl}
      />
      <LensterShareButton
        text={text.lenster}
        hashTags={hashTags}
        url={LINKS.app}
        fullSized={true}
        intl={intl}
      />
    </>
  )
}

type SharePlatform = 'twitter' | 'lenster'

const getShareText = (tokenSymbol: string, platform: SharePlatform) => {
  const protocolAccounts: Record<SharePlatform, string> = {
    twitter: '@PoolTogether_',
    lenster: '@pooltogether.lens'
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
