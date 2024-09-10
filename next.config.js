/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        fs: false,
        child_process: false,
        http2: false,
        http: false,
        https: false,
        zlib: false,
        path: false,
        stream: false,
        util: false,
        url: false,
        crypto: false,
      };
    }
    return config;
  },
  // Add this to ensure proper routing
  async redirects() {
    return [];
  },
};

module.exports = nextConfig;
