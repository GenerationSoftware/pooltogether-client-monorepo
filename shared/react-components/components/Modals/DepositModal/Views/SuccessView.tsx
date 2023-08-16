import {
  formatCurrencyNumberForDisplay,
  formatNumberForDisplay,
  getBlockExplorerName,
  getBlockExplorerUrl,
  getNiceNetworkNameByChainId,
  NETWORK,
  PRIZE_POOLS,
  USDC_TOKEN_ADDRESSES,
  Vault
} from '@pooltogether/hyperstructure-client-js'
import {
  useGrandPrize,
  usePrizePool,
  useTokenPrices,
  useVaultTokenData
} from '@pooltogether/hyperstructure-react-hooks'
import { Intl } from '@shared/types'
import { Button, ExternalLink, LINKS } from '@shared/ui'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'
import { Address, formatUnits } from 'viem'
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
          text={intl?.common?.('viewOn', { name }) ?? `View on ${name}`}
          size='sm'
          className='text-pt-teal'
        />
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

  const prizePoolAddress = PRIZE_POOLS.find((pool) => pool.chainId === vault.chainId)
    ?.address as Address
  const prizePool = usePrizePool(vault.chainId, prizePoolAddress)
  const { data: grandPrize } = useGrandPrize(prizePool)

  const { data: tokenPrices } = useTokenPrices(NETWORK.mainnet, [
    USDC_TOKEN_ADDRESSES[NETWORK.mainnet]
  ])

  const network = getNiceNetworkNameByChainId(vault.chainId)
  const hashTags = ['PoolTogether', network]

  // TODO: improve and add more alternatives to this text (emojis? :D)
  const text = useMemo(() => {
    if (!!tokenData && !!grandPrize && !!tokenPrices) {
      const tokenSymbol = tokenData.symbol
      const grandPrizeAmount = parseFloat(formatUnits(grandPrize.amount, grandPrize.decimals))
      const grandPrizeValue = grandPrizeAmount * grandPrize.price
      const usdPrice = tokenPrices[USDC_TOKEN_ADDRESSES[NETWORK.mainnet]]
      const formattedGrandPrizeValue = formatCurrencyNumberForDisplay(
        !!usdPrice ? grandPrizeValue * (1 / usdPrice) : grandPrizeValue,
        !!usdPrice ? 'usd' : 'eth',
        { hideZeroes: true }
      )
      return `I've just deposited some ${tokenSymbol} into PoolTogether! Watch me win the next ${formattedGrandPrizeValue} prize.`
    }
  }, [tokenData, grandPrize, tokenPrices])

  return (
    <>
      <TwitterShareButton
        text={text}
        hashTags={hashTags}
        url={LINKS.app}
        fullSized={true}
        intl={intl}
      />
      <LensterShareButton
        text={text}
        hashTags={hashTags}
        url={LINKS.app}
        fullSized={true}
        intl={intl}
      />
    </>
  )
}
