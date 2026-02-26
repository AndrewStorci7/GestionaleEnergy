/** @type {import('next').NextConfig} */
// const nextConfig = {
//     experimental: {
//         turbo: false,
//     }
// };

const nextConfig = {
    reactStrictMode: true,
    outputFileTracingExcludes: {
        "*": [
            "./**/*.spec.js",
            "./**/*.test.js",
            "./**/*.stories.js",
        ],
    },
};

export default nextConfig;
