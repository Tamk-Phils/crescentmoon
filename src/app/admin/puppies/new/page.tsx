'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Upload, Save, X } from 'lucide-react'

export default function AdminNewPuppyPage() {
    const router = useRouter()
    const supabase = createClient()

    const [formData, setFormData] = useState({
        name: '',
        breed: 'Cocker Spaniel',
        age: '',
        gender: 'Male',
        adoption_fee: 2500,
        status: 'available',
        description: ''
    })

    const [images, setImages] = useState<string[]>([])

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.result) {
                    setImages(prev => [...prev, reader.result as string]);
                }
            };
            reader.readAsDataURL(file);
        });
    }

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const dbPayload = {
            ...formData,
            images: images
        }

        const { error } = await supabase.from('puppies').insert([dbPayload])

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            router.push('/admin/puppies')
        }
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-6 flex items-center gap-4">
                <Link href="/admin/puppies" className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </Link>
                <div>
                    <h1 className="text-3xl font-serif text-primary-950">Add New Puppy</h1>
                    <p className="text-gray-500 mt-1">Create a new listing for the website.</p>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-100">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                        <input
                            type="text" required
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-300 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Breed</label>
                        <input
                            type="text" required
                            value={formData.breed}
                            onChange={e => setFormData({ ...formData, breed: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-300 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                        <input
                            type="text" required placeholder="e.g. 8 Weeks"
                            value={formData.age}
                            onChange={e => setFormData({ ...formData, age: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-300 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                        <select
                            value={formData.gender}
                            onChange={e => setFormData({ ...formData, gender: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-300 outline-none"
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Adoption Fee ($)</label>
                        <input
                            type="number" required
                            value={formData.adoption_fee}
                            onChange={e => setFormData({ ...formData, adoption_fee: Number(e.target.value) })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-300 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select
                            value={formData.status}
                            onChange={e => setFormData({ ...formData, status: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-300 outline-none"
                        >
                            <option value="available">Available</option>
                            <option value="pending">Pending</option>
                            <option value="adopted">Adopted</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                        required rows={4}
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-300 outline-none resize-none"
                    ></textarea>
                </div>

                <div className="border border-dashed border-gray-300 rounded-xl p-8 bg-gray-50 flex flex-col items-center relative overflow-hidden">
                    <Upload className="w-8 h-8 text-gray-400 mb-3" />
                    <h3 className="font-medium text-gray-800 mb-1">Upload Actual Images</h3>
                    <p className="text-xs text-gray-500 mb-4">Click below or drag and drop to upload (.jpg, .png)</p>
                    <div className="relative w-full max-w-md">
                        <input
                            type="file" multiple accept="image/*"
                            onChange={handleImageUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <button type="button" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl font-medium text-primary-700 shadow-sm pointer-events-none">
                            Select Files
                        </button>
                    </div>

                    {images.length > 0 && (
                        <div className="flex flex-wrap gap-4 mt-6 w-full justify-center">
                            {images.map((img, idx) => (
                                <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                                    <img src={img} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(idx)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 focus:outline-none"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex justify-end border-t border-gray-100 pt-6">
                    <button
                        type="submit" disabled={loading}
                        className="bg-primary-700 hover:bg-primary-600 text-white px-8 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors disabled:opacity-70 shadow-sm"
                    >
                        <Save className="w-5 h-5" /> {loading ? 'Saving...' : 'Save Puppy'}
                    </button>
                </div>
            </form>
        </div>
    )
}
