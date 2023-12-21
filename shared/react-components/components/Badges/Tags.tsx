import { Vault } from '@generationsoftware/hyperstructure-client-js'

export interface TagsProps {
  vault: Vault
  className?: string
}

export const Tags = (props: TagsProps) => {
  const { vault } = props

  if (vault.tags && vault.tags.length > 0) {
    return <span className='gap-1'> - {vault.tags.join(',')}</span>
  } else {
    return null
  }
}
