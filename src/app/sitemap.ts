import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/client'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://crescentmoonspaniels.com'
    const supabase = createClient()

    // Base routes
    const routes = ['', '/about', '/browse', '/faq', '/contact', '/care-and-training'].map(route => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    // Puppy detail routes
    const { data: puppies } = await supabase
        .from('puppies')
        .select('id')
        .eq('status', 'available')

    const puppyRoutes = (puppies || []).map(puppy => ({
        url: `${baseUrl}/puppies/${puppy.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }))

    return [...routes, ...puppyRoutes]
}
