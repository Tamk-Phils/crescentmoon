'use client'

import { motion } from 'framer-motion'
import { Dog } from 'lucide-react'

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#e6e2f0]/80 backdrop-blur-md">
            <div className="flex flex-col items-center">
                <div className="relative">
                    {/* Outer Moon-like spinning ring */}
                    <motion.div
                        className="w-24 h-24 border-4 border-primary-200 border-t-primary-600 rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                    
                    {/* Inner glowing icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                            animate={{ 
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 1, 0.5]
                            }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <Dog className="w-10 h-10 text-primary-800" />
                        </motion.div>
                    </div>
                </div>
                
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 text-primary-900 font-serif text-xl tracking-wide italic"
                >
                    Waking up the puppies...
                </motion.p>
            </div>
        </div>
    )
}
