import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { Tooltip } from '@shared/ui'
import { OLD_VAULT_NEW_VAULT_MAPPING } from '@constants/config'

interface DeprecatedExclamationProps {
  vault: Vault
}

export const DeprecatedExclamation = (props: DeprecatedExclamationProps) => {
  const { vault } = props

  return vault.tags && vault.tags.includes('deprecated') ? (
    <Tooltip
      content={
        <div className='max-w-[32ch] flex flex-col gap-2 text-start'>
          <div className='font-bold'>Deposits disabled</div>
          <span>
            This vault has been deprecated. It is still eligible to win prizes, but we encourage
            users to migrate to the new{' '}
            {vault.tokenData?.symbol && OLD_VAULT_NEW_VAULT_MAPPING[vault.tokenData?.symbol]} vault.
          </span>
        </div>
      }
    >
      <Exclamation />
    </Tooltip>
  ) : null
}

const Exclamation = () => {
  return (
    <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M8.25685 3.0991C9.02185 1.7391 10.9788 1.7391 11.7428 3.0991L17.3228 13.0191C18.0728 14.3531 17.1098 15.9991 15.5808 15.9991H4.41985C2.88985 15.9991 1.92685 14.3531 2.67685 13.0191L8.25685 3.0991ZM10.9998 13.0001C10.9998 13.2653 10.8945 13.5197 10.707 13.7072C10.5194 13.8947 10.2651 14.0001 9.99985 14.0001C9.73463 14.0001 9.48028 13.8947 9.29274 13.7072C9.10521 13.5197 8.99985 13.2653 8.99985 13.0001C8.99985 12.7349 9.10521 12.4805 9.29274 12.293C9.48028 12.1055 9.73463 12.0001 9.99985 12.0001C10.2651 12.0001 10.5194 12.1055 10.707 12.293C10.8945 12.4805 10.9998 12.7349 10.9998 13.0001ZM9.99985 5.0001C9.73463 5.0001 9.48028 5.10546 9.29274 5.29299C9.10521 5.48053 8.99985 5.73488 8.99985 6.0001V9.0001C8.99985 9.26532 9.10521 9.51967 9.29274 9.70721C9.48028 9.89474 9.73463 10.0001 9.99985 10.0001C10.2651 10.0001 10.5194 9.89474 10.707 9.70721C10.8945 9.51967 10.9998 9.26532 10.9998 9.0001V6.0001C10.9998 5.73488 10.8945 5.48053 10.707 5.29299C10.5194 5.10546 10.2651 5.0001 9.99985 5.0001Z'
        fill='#DECEFF'
      />
    </svg>
  )
}
