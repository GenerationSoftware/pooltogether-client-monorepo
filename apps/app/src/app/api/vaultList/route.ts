import { NextResponse } from 'next/server'

export function GET(): NextResponse {
  return NextResponse.json({ vaultLists: ['default'] }, { status: 200 })
}
