import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin', '/api/admin'], // Keep admin secure from crawlers
            },
        ],
        sitemap: 'https://nomoredms.com/sitemap.xml',
    };
}
