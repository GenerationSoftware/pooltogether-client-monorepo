import { useSetAtom } from 'jotai'
import { useRouter } from 'next/router'
import { vaultAddressAtom, vaultChainIdAtom } from 'src/atoms'
import { SupportedNetwork } from 'src/types'
import { isAddress } from 'viem'
import { DeployedVaultInfo } from '@components/DeployedVaultInfo'
import { Layout } from '@components/Layout'
import { LiquidationPairStepContent } from '@components/LiquidationPairStepContent'
import { LiquidationPairStepInfo } from '@components/LiquidationPairStepInfo'
import { SUPPORTED_NETWORKS } from '@constants/config'

export default function LiquidationPairPage() {
  const router = useRouter()

  const setVaultChainId = useSetAtom(vaultChainIdAtom)
  const setVaultAddress = useSetAtom(vaultAddressAtom)

  if (router.isReady) {
    const chainId =
      !!router.query.chainId &&
      typeof router.query.chainId === 'string' &&
      SUPPORTED_NETWORKS.includes(parseInt(router.query.chainId))
        ? (parseInt(router.query.chainId) as SupportedNetwork)
        : undefined

    const address =
      !!router.query.vaultAddress &&
      typeof router.query.vaultAddress === 'string' &&
      isAddress(router.query.vaultAddress)
        ? router.query.vaultAddress
        : undefined

    if (!!chainId && !!address) {
      setVaultChainId(chainId)
      setVaultAddress(address)

      return (
        <Layout isSidebarActive={true}>
          <div className='w-full flex flex-col grow gap-8 lg:flex-row lg:gap-4'>
            <div className='flex flex-col shrink-0 gap-8 items-center p-6 bg-pt-transparent lg:w-[27rem] lg:py-0 lg:pl-2 lg:pr-6 lg:bg-transparent'>
              <LiquidationPairStepInfo className='w-full grow items-center justify-center lg:items-start' />
              <DeployedVaultInfo className='w-full' />
            </div>
            <LiquidationPairStepContent />
          </div>
        </Layout>
      )
    } else {
      router.replace('/')
    }
  }
}
