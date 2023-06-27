export interface ERC2612PermitMessage {
  owner: string
  spender: string
  value: number | string
  nonce: number | string
  deadline: number | string
}

export interface EIP2612SignatureTuple {
  deadline: number
  v: number
  r: string
  s: string
}
