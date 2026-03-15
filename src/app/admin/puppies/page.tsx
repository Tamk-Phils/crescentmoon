'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Edit, Trash2 } from 'lucide-react'

export default function AdminPuppiesPage() {
    const [puppies, setPuppies] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        fetchPuppies()
    }, [])

    async function fetchPuppies() {
        try {
            const { data, error } = await supabase.from('puppies').select('*').order('created_at', { ascending: false })
            if (error) throw error
            setPuppies(data || [])
        } catch (err: any) {
            console.error('Error fetching puppies:', err)
        } finally {
            setLoading(false)
        }
    }

    async function deletePuppy(id: string) {
        if (!confirm('Are you sure you want to delete this puppy?')) return
        
        // Optimistic update
        const previousPuppies = [...puppies]
        setPuppies(puppies.filter(p => p.id !== id))

        try {
            const { error } = await supabase.from('puppies').delete().eq('id', id)
            if (error) {
                // Check for PostgreSQL error codes
                if (error.code === '23503') {
                    throw new Error('Cannot delete this puppy because there are adoption requests or messages linked to it. Please delete the linked requests first.')
                }
                if (error.code === '42501') {
                    throw new Error('Permission denied. Your account may not have the admin role in the database, even if you are logged in.')
                }
                throw error
            }
        } catch (err: any) {
            console.error('Error deleting puppy:', err)
            alert(err.message || 'An unexpected error occurred.')
            setPuppies(previousPuppies) // Rollback
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-serif text-primary-950">Puppies Inventory</h1>
                    <p className="text-gray-500 mt-1">Manage all available and pending puppies.</p>
                </div>
                <Link
                    href="/admin/puppies/new"
                    className="bg-primary-700 hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus className="w-4 h-4" /> Add Puppy
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-400">Loading inventory...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[600px]">
                            <thead className="bg-gray-50 text-gray-500 text-sm">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Puppy</th>
                                    <th className="px-6 py-4 font-medium">Details</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium">Fee</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {puppies.map((puppy) => (
                                    <tr key={puppy.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 relative shrink-0">
                                                    {puppy.images?.[0] && (
                                                        <Image src={puppy.images[0]} alt={puppy.name} fill className="object-cover" />
                                                    )}
                                                </div>
                                                <span className="font-medium text-gray-900 truncate max-w-[120px]">{puppy.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <span className="whitespace-nowrap">{puppy.breed}</span>
                                            <div className="text-xs text-gray-400">{puppy.age} • {puppy.gender}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${puppy.status === 'available' ? 'bg-green-100 text-green-700' :
                                                puppy.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                                                    'bg-gray-100 text-gray-700'
                                                }`}>
                                                {puppy.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            ${puppy.adoption_fee}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={`/admin/puppies/edit/${puppy.id}`}
                                                    className="p-3 text-gray-400 hover:text-primary-600 rounded-lg transition-colors bg-gray-50 md:bg-transparent"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </Link>
                                                <button
                                                    onClick={() => deletePuppy(puppy.id)}
                                                    className="p-3 text-gray-400 hover:text-red-600 rounded-lg transition-colors bg-gray-50 md:bg-transparent"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {puppies.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                            No puppies found in inventory.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
