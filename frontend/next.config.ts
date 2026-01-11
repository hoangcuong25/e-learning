/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.example.com",
        pathname: "/account123/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "qr.sepay.vn",
        pathname: "/**",
      },
    ],
    domains: ["res.cloudinary.com"],
  },
};

module.exports = nextConfig;
