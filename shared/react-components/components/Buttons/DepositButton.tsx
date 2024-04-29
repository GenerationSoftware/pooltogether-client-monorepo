import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useSelectedVault,
  useTokenPrices,
  useVaultTokenData,
  useVaultTwabController
} from '@generationsoftware/hyperstructure-react-hooks'
import { MODAL_KEYS, useIsModalOpen } from '@shared/generic-react-hooks'
import { Intl } from '@shared/types'
import { Button, ButtonProps } from '@shared/ui'
import { lower, PRIZE_POOLS, USDC_TOKEN_ADDRESSES } from '@shared/utilities'
import classNames from 'classnames'
import { useMemo } from 'react'
import { BadPrecisionPerDollarTooltip } from '../Tooltips/BadPrecisionPerDollarTooltip'
import { DeprecatedVaultTooltip } from '../Tooltips/DeprecatedVaultTooltip'
import { WrongPrizePoolVaultTooltip } from '../Tooltips/WrongPrizePoolVaultTooltip'

export interface DepositButtonProps extends Omit<ButtonProps, 'onClick' | 'children'> {
  vault: Vault
  intl?: {
    base: Intl<'deposit'>
    tooltips: Intl<'deprecatedVault' | 'wrongPrizePoolVault' | 'badPrecisionPerDollar'>
  }
}

export const DepositButton = (props: DepositButtonProps) => {
  const { vault, className, intl, ...rest } = props

  const { setIsModalOpen } = useIsModalOpen(MODAL_KEYS.deposit)

  const { setSelectedVaultById } = useSelectedVault()

  const { data: token } = useVaultTokenData(vault)

  const { data: tokenPrices } = useTokenPrices(
    vault.chainId,
    !!token?.address ? [token.address, USDC_TOKEN_ADDRESSES[vault.chainId]] : []
  )

  const { data: vaultTwabController } = useVaultTwabController(vault)

  const isWrongPrizePool = useMemo(() => {
    if (!!vaultTwabController) {
      const prizePoolTwabController = PRIZE_POOLS.find((pool) => pool.chainId === vault.chainId)
        ?.options.twabControllerAddress

      if (!!prizePoolTwabController) {
        return vaultTwabController.toLowerCase() !== prizePoolTwabController.toLowerCase()
      }
    }
  }, [vaultTwabController])

  const isBadPrecisionPerDollar = useMemo(() => {
    if (!!token && !!tokenPrices) {
      const tokenPrice = tokenPrices[lower(token.address)]
      const usdcPrice = tokenPrices[USDC_TOKEN_ADDRESSES[token.chainId]]

      if (!!tokenPrice && !!usdcPrice) {
        const precision = 10 ** token.decimals / tokenPrice
        const usdcPrecision = 10 ** 6 / usdcPrice // TODO: this assumes all USDC tokens have 6 decimals

        return precision < usdcPrecision
      }
    }
  }, [token, tokenPrices])

  const handleClick = () => {
    setSelectedVaultById(vault.id)
    setIsModalOpen(true)
  }

  const isDeprecated = vault.tags?.includes('deprecated')

  const buttonContent = intl?.base('deposit') ?? 'Deposit'
  const buttonClassName = classNames('w-fit', className)

  if (isDeprecated) {
    return (
      <DeprecatedVaultTooltip intl={intl?.tooltips('deprecatedVault')}>
        <Button onClick={handleClick} className={buttonClassName} disabled={true} {...rest}>
          {buttonContent}
        </Button>
      </DeprecatedVaultTooltip>
    )
  }

  if (isWrongPrizePool) {
    return (
      <WrongPrizePoolVaultTooltip intl={intl?.tooltips('wrongPrizePoolVault')}>
        <Button onClick={handleClick} className={buttonClassName} disabled={true} {...rest}>
          {buttonContent}
        </Button>
      </WrongPrizePoolVaultTooltip>
    )
  }

  if (isBadPrecisionPerDollar) {
    return (
      <BadPrecisionPerDollarTooltip intl={intl?.tooltips('badPrecisionPerDollar')}>
        <Button onClick={handleClick} className={buttonClassName} disabled={true} {...rest}>
          {buttonContent}
        </Button>
      </BadPrecisionPerDollarTooltip>
    )
  }

  return (
    <Button onClick={handleClick} className={buttonClassName} {...rest}>
      {buttonContent}
    </Button>
  )
}
