import { Mutable, VaultExtensions, VaultInfo, VaultList } from '@shared/types'

export type AppView = 'base' | 'editing' | 'preview'

export type FormKey =
  | 'vaultListSrc'
  | 'vaultListName'
  | 'vaultListKeyword'
  | 'vaultListImage'
  | 'vaultName'
  | 'vaultAddress'
  | 'vaultChainId'
  | 'vaultYieldSourceURI'
  | 'text'

export type MutableVaultList = Omit<Mutable<VaultList>, 'tokens'> & {
  tokens: MutableVaultInfo[]
}
export type MutableVaultInfo = Omit<Mutable<VaultInfo>, 'extensions'> & {
  extensions?: MutableVaultExtensions
}
export type MutableVaultExtensions = Omit<Mutable<VaultExtensions>, 'underlyingAsset'> & {
  underlyingAsset?: Mutable<VaultExtensions['underlyingAsset']>
}
