'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { PawPrint } from 'lucide-react'
import { Carousel } from './carousel'

interface DogCardProps {
    id: string
    name: string
    description: string
    imageUrl: string
    images?: string[]
    variant?: 'white' | 'green'
}

export function DogCard({ id, name, description, imageUrl, images, variant = 'white' }: DogCardProps) {
    const bgClass = variant === 'green' ? 'bg-[#b2d3c2]' : 'bg-white'
    const displayImages = images && images.length > 0 ? images : [imageUrl]

    return (
        <Link href={`/puppies/${id}`} className="block w-full max-w-[320px] mx-auto group/card">
            <motion.div
                whileHover={{ y: -5 }}
                className={`rounded-[2rem] p-4 flex flex-col items-center text-center shadow-sm w-full h-full transition-shadow hover:shadow-xl ${bgClass}`}
            >
                <div className="w-full aspect-square relative mb-6 overflow-hidden arched-image bg-gray-200">
                    <Carousel
                        images={displayImages}
                        className="w-full h-full"
                    />
                </div>

                <h3 className="text-3xl font-serif text-primary-950 mb-3">{name}</h3>

                <p className="text-sm text-primary-800/80 mb-6 leading-relaxed px-2">
                    {description}
                </p>

                <div className="w-full mt-auto">
                    <button className="w-full bg-primary-700 group-hover/card:bg-primary-600 text-white rounded-full py-3.5 px-6 flex items-center justify-center gap-2 transition-all font-medium text-lg shadow-md group">
                        <PawPrint className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        Adopt Me
                    </button>
                </div>
            </motion.div>
        </Link>
    )
}
