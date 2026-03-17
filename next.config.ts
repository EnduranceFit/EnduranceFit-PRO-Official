import type { NextConfig } from "next";

const nextConfig = {
  output: 'export',
  reactStrictMode: false,
  serverExternalPackages: ['archiver'],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
