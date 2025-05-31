/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ciolnkgelnsdnlgasagz.supabase.co',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
