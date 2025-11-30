/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
            },
            {
                protocol: "http",
                hostname: "res.cloudinary.com", // in case your URLs use plain HTTP
            },
        ],
    },
};

module.exports = nextConfig;
