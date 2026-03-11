import { Navbar } from '@/components/layout/navbar'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Carousel } from '@/components/ui/carousel'
import { Metadata } from 'next'

export const revalidate = 0

type Props = {
    params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params
    const supabase = createClient()

    const { data: puppy } = await supabase
        .from('puppies')
        .select('*')
        .eq('id', id)
        .single()

    if (!puppy) {
        return {
            title: 'Puppy Not Found',
        }
    }

    const title = `${puppy.name} | Available ${puppy.gender} ${puppy.breed}`
    const description = puppy.description || `Meet ${puppy.name}, a beautiful ${puppy.gender} ${puppy.breed} puppy available for adoption at Crescent Moon Cocker Spaniels.`

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: puppy.images?.[0] ? [{ url: puppy.images[0] }] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: puppy.images?.[0] ? [puppy.images[0]] : [],
        },
    }
}

export default async function PuppyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = createClient()

    const { data: puppy, error } = await supabase
        .from('puppies')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !puppy) {
        // If not found, show a 404
        notFound()
    }

    const mainImage = puppy.images?.[0] || 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&q=80'

    return (
        <main className="min-h-screen w-full flex flex-col bg-[#fdfbf7]">
            <div className="bg-primary-900">
                <Navbar />
            </div>

            <div className="flex-grow max-w-6xl mx-auto px-6 py-16 w-full grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Images Section */}
                <div className="space-y-4">
                    <Carousel
                        images={puppy.images || []}
                        className="rounded-[2rem] arched-image shadow-md"
                    />
                </div>

                {/* Details Section */}
                <div className="flex flex-col justify-center">
                    <h1 className="text-5xl md:text-6xl font-serif text-primary-950 mb-4">{puppy.name}</h1>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100 text-primary-800 font-medium text-sm w-fit mb-6">
                        <div className={`w-2 h-2 rounded-full ${puppy.status === 'available' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                        {puppy.status.charAt(0).toUpperCase() + puppy.status.slice(1)}
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-8 text-lg">
                        <div>
                            <p className="text-gray-500 text-sm mb-1">Breed</p>
                            <p className="font-medium text-gray-900">{puppy.breed}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm mb-1">Age</p>
                            <p className="font-medium text-gray-900">{puppy.age}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm mb-1">Gender</p>
                            <p className="font-medium text-gray-900">{puppy.gender}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm mb-1">Adoption Fee</p>
                            <p className="font-medium text-gray-900">${puppy.adoption_fee}</p>
                        </div>
                    </div>

                    <div className="mb-10">
                        <h3 className="text-2xl font-serif text-primary-900 mb-3">About {puppy.name}</h3>
                        <p className="text-gray-700 leading-relaxed">
                            {puppy.description || `Meet ${puppy.name}, a wonderful ${puppy.breed} looking for a loving family. They have been vet-checked, vaccinated, and are well-socialized.`}
                        </p>
                    </div>

                    <div className="mt-auto space-y-4">
                        <Link href={`/checkout/deposit/${puppy.id}`} className="block">
                            <button
                                disabled={puppy.status !== 'available'}
                                className="w-full bg-primary-700 hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full py-4 px-6 font-medium text-xl shadow-lg transition-all text-center"
                            >
                                Apply to Adopt {puppy.name}
                            </button>
                        </Link>
                        <Link href="/chat" className="block text-center text-primary-600 hover:text-primary-800 font-medium py-2">
                            Ask a question about {puppy.name}
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    )
}
