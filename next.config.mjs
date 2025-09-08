/** @type {import('next').NextConfig} */
const nextConfig = {
  // Silence warnings
  // https://github.com/WalletConnect/walletconnect-monorepo/issues/1908
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // Increase body size limit for image uploads
    },
  },
};

export default nextConfig;
