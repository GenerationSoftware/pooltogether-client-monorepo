import memeVaultList from '@vaultLists/meme'
import { NextResponse } from 'next/server'

export function GET(): NextResponse {
  return NextResponse.json(memeVaultList, { status: 200 })
}
