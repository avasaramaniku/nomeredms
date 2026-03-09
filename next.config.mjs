const nextConfig = {
<<<<<<< HEAD
    images: {
        minimumCacheTTL: 60,
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
=======
    experimental: {
        turbopack: {
            root: '.',
        },
    },
    images: {
>>>>>>> origin/main
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'picsum.photos',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'ysifwdjeekxwofftiuea.supabase.co',
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
            },
            {
                protocol: 'https',
                hostname: 'pbs.twimg.com',
            },
            {
                protocol: 'https',
                hostname: 'abs.twimg.com',
            },
        ],
    },
<<<<<<< HEAD
    compress: true,
    reactStrictMode: true,
    poweredByHeader: false,
=======
>>>>>>> origin/main
};

export default nextConfig;
