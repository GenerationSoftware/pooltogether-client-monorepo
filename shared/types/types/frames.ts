export interface FrameRequest {
  untrustedData: FrameData
  trustedData: {
    messageBytes: string
  }
}

export interface FrameData {
  fid: number
  url: string
  messageHash: string
  timestamp: number
  network: number
  buttonIndex: number
  castId: { fid: number; hash: string }
  inputText?: string
  transactionId?: string
  state?: string
}

export type FrameButton =
  | { content: string; action?: 'post' }
  | { content: string; action: 'post_redirect' }
  | { content: string; action: 'link'; target: string }
  | { content: string; action: 'mint'; target: string }
  | { content: string; action: 'tx'; target: string; callback: string }
