export default {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '8001',
        pathname: '/uploads/**',
      },
    ],
  },
};
