/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },

      {
        protocol: "https",
        hostname: "s3.sellerpintar.com",
      },
    ],
  },
};

export default nextConfig;
