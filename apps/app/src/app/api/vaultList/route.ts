import { NextResponse } from 'next/server'

export function GET(): NextResponse {
  return NextResponse.json({ vaultLists: ['default', 'meme'] }, { status: 200 })
}
