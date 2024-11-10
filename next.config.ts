import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com/sutharjay/image/upload/v1731225429/togl/",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
