/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: [],
    unoptimized: true,
  },
  experimental: {},
  // PWA via next-pwa
  // Note: For full PWA support, install next-pwa and configure it
  // headers: async () => [
  //   {
  //     source: '/manifest.json',
  //     headers: [
  //       { key: 'Content-Type', value: 'application/manifest+json' },
  //     ],
  //   },
  // ],
};

export default nextConfig;
