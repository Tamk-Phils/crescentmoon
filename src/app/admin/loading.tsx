'use client'

import { motion } from 'framer-motion'
import { Dog } from 'lucide-react'

export default function AdminLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full gap-4">
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="bg-primary-50 p-6 rounded-3xl shadow-sm border border-primary-100"
      >
        <Dog className="w-12 h-12 text-primary-600" />
      </motion.div>
      <div className="flex flex-col items-center gap-1">
        <p className="text-primary-900 font-serif text-xl font-medium">Fetching Data</p>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              className="w-1.5 h-1.5 bg-primary-400 rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
