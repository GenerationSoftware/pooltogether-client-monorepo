import defaultVaultList from '@vaultLists/default'
import { NextResponse } from 'next/server'

export function GET(): NextResponse {
  return NextResponse.json(defaultVaultList, { status: 200 })
}
