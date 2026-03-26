/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {}, // Алдааг дарахын тулд хоосон объект тавив
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        dns: false,
        fs: false,
        child_process: false,
        timers: false,
      };
    }
    return config;
  },
  reactStrictMode: true,
};
export default nextConfig;
