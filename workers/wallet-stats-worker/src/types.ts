import { Address } from 'viem'

export interface Deposit {
  user: Address
  vault: Address
  wallet: string
  chainId: number
  ethValue: number
}
