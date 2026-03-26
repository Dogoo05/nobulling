/** @type {import('next').NextConfig} */
const nextConfig = {
  // Turbopack-д Node.js-ийн сангуудыг ignore хийхийг хэлж өгөх хэсэг
  experimental: {
    turbo: {
      resolveAlias: {
        // Эдгээр сангуудыг браузер талд хайхгүй байх тохиргоо
        net: false,
        tls: false,
        dns: false,
        fs: false,
        child_process: false,
        timers: false,
      },
    },
  },
  // Стандарт webpack ашиглах үед бас ажиллахаар давхар бичиж өгнө
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
};

export default nextConfig;
