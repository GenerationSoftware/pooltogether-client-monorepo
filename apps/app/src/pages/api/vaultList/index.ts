import fs from 'fs'
import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const listNames = fs
    .readdirSync('src/pages/api/vaultList')
    .filter((name) => name !== 'index.ts')
    .map((name) => `/${name.slice(0, -3)}`)

  res.status(200).json({ vaultLists: listNames })
}
