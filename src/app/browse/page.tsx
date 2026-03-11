import { Navbar } from '@/components/layout/navbar'
import { DogCard } from '@/components/ui/dog-card'
import { createClient } from '@/lib/supabase/client'
import { PawPrint } from 'lucide-react'

// Fetch puppies from Supabase. We do this in a Server Component.
// Wait, the createBrowserClient is for client. For server, we should ideally use `@supabase/ssr` serverClient.
// Let's create a server helper or just fetch directly if we only need public data.
// Since RLS allows anyone to view available puppies, we can use the regular Supabase REST API or just the browser client inside the server component if we don't need auth cookies for this specific fetch, but it's better to maintain pattern.
// For simplicity in this demo, since 'available' is public, using the standard client is fine.
export const revalidate = 0 // Disable caching for realtime updates

export default async function BrowsePage() {
    const supabase = createClient()

    const { data: puppies, error } = await supabase
        .from('puppies')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false })

    return (
        <main className="min-h-screen w-full relative flex flex-col bg-gradient-to-b from-[#e6e2f0] via-[#f7f6f1] to-[#e8e4xce]">
            <div className="bg-primary-900 pb-16 pt-6">
                <Navbar />
                <div className="max-w-6xl mx-auto px-6 mt-12 text-center text-white">
                    <h1 className="text-5xl md:text-6xl font-serif mb-4">Available Puppies</h1>
                    <p className="text-lg opacity-90 max-w-2xl mx-auto">
                        Meet our beautiful, well-socialized Cocker Spaniel puppies. They are waiting for their forever homes.
                    </p>
                </div>
            </div>

            <div className="flex-grow max-w-6xl mx-auto px-6 py-20 w-full">
                {error && (
                    <div className="text-red-500 text-center py-10">
                        Failed to load puppies. Please ensure the database schema is setup.
                    </div>
                )}

                {!error && (!puppies || puppies.length === 0) && (
                    <div className="text-center py-20 flex flex-col items-center">
                        <PawPrint className="w-16 h-16 text-primary-300 mb-4" />
                        <h2 className="text-2xl font-serif text-primary-900 mb-2">No puppies available right now</h2>
                        <p className="text-primary-800/70">Please check back later or contact us to join the waitlist.</p>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 place-items-center">
                    {puppies?.map((puppy, index) => (
                        <DogCard
                            key={puppy.id}
                            id={puppy.id}
                            name={puppy.name}
                            description={`${puppy.breed} • ${puppy.age} • ${puppy.gender}`}
                            imageUrl={puppy.images && puppy.images.length > 0 ? puppy.images[0] : 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&q=80'}
                            images={puppy.images}
                            variant={index % 2 === 0 ? 'white' : 'green'}
                        />
                    ))}
                </div>
            </div>

            <footer className="w-full bg-[#5d5955] text-white py-10 px-8 text-center text-sm opacity-90">
                Copyright crescentmoonspaniels.com
            </footer>
        </main>
    )
}
