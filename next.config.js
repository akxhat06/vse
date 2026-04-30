/** @type {import('next').NextConfig} */
const nextConfig = {
  // Mobile webviews can send dev resource origin in different shapes
  // (host-only, host:port, or full URL), so allow common LAN variants.
  allowedDevOrigins: [
    '192.168.0.2',
    '192.168.0.2:3000',
    'http://192.168.0.2',
    'http://192.168.0.2:3000',
  ],
};

module.exports = nextConfig;