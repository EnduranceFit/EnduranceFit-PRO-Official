const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true';

const nextConfig: import("next").NextConfig = {
  output: isStaticExport ? 'export' : undefined,
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
