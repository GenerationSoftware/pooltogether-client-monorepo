/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: [
    'file:../../shared/generic-react-hooks',
    'file:../../shared/react-components',
    'file:../../shared/types',
    'file:../../shared/ui',
    'file:../../shared/utilities',
    '@lifi/widget',
    '@lifi/wallet-management'
  ],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = { fs: false, net: false, tls: false }
    }
    return config
  }
}
