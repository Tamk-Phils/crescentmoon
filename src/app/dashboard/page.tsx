'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Navbar } from '@/components/layout/navbar'
import Link from 'next/link'
import { LogOut, User as UserIcon, Settings, Heart } from 'lucide-react'

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const [requests, setRequests] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        async function fetchDashboard() {
            const { data: { session } } = await supabase.auth.getSession()

            if (!session) {
                window.location.href = '/login'
                return
            }

            setUser(session.user)

            // Fetch profile
            const { data: profileData } = await supabase
                .from('users')
                .select('*')
                .eq('id', session.user.id)
                .single()

            setProfile(profileData)

            // Fetch adoption requests
            const { data: requestData } = await supabase
                .from('adoption_requests')
                .select('*, puppies(*)')
                .eq('user_id', session.user.id)
                .order('created_at', { ascending: false })

            setRequests(requestData || [])
            setLoading(false)
        }

        fetchDashboard()
    }, [])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        window.location.href = '/'
    }

    if (loading) return <div className="min-h-screen bg-[#fdfbf7] flex items-center justify-center p-8 text-gray-500">Loading dashboard...</div>

    return (
        <main className="min-h-screen w-full bg-[#fdfbf7] flex flex-col">
            <div className="bg-primary-950 pb-8 pt-6 rounded-b-[3rem] shadow-xl relative z-10 shrink-0">
                <Navbar />
            </div>

            <div className="flex-grow max-w-6xl mx-auto w-full px-6 py-12 flex flex-col md:flex-row gap-8">

                {/* Sidebar */}
                <div className="w-full md:w-1/4">
                    <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden sticky top-8">
                        <div className="p-8 text-center border-b border-gray-100 bg-gray-50">
                            <div className="w-20 h-20 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <UserIcon className="w-10 h-10" />
                            </div>
                            <h2 className="text-xl font-serif text-primary-950">{profile?.full_name || 'Family Member'}</h2>
                            <p className="text-sm text-gray-500">{user?.email}</p>
                        </div>
                        <div className="p-4 space-y-2">
                            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-primary-50 text-primary-900 rounded-xl font-medium transition-colors">
                                <Heart className="w-5 h-5" /> My Adoptions
                            </Link>
                            <Link href="/chat" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                                <Settings className="w-5 h-5" /> Messages
                            </Link>
                        </div>
                        <div className="p-4 border-t border-gray-100">
                            <button
                                onClick={handleSignOut}
                                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium text-left"
                            >
                                <LogOut className="w-5 h-5" /> Sign Out
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="w-full md:w-3/4 space-y-8">
                    <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 p-8 md:p-12">
                        <h1 className="text-3xl font-serif text-primary-950 mb-8">My Adoption Requests</h1>

                        {requests.length === 0 ? (
                            <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No adoption requests yet</h3>
                                <p className="text-gray-500 mb-6">When you apply to adopt a puppy, your requests will appear here.</p>
                                <Link href="/browse" className="inline-block bg-primary-700 hover:bg-primary-600 text-white font-medium py-3 px-8 rounded-full transition-colors shadow-lg">
                                    Browse Available Puppies
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {requests.map(req => (
                                    <div key={req.id} className="border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                                        <div>
                                            <h3 className="text-xl font-serif text-primary-900 mb-1">Applying for: {req.puppies?.name}</h3>
                                            <p className="text-sm text-gray-500 mb-4">Applied on {new Date(req.created_at).toLocaleDateString()}</p>

                                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${req.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                    req.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                        'bg-orange-100 text-orange-700'
                                                }`}>
                                                {req.status}
                                            </span>
                                        </div>
                                        {req.status === 'approved' && (
                                            <div className="bg-green-50 p-4 rounded-xl text-green-800 text-sm max-w-sm border border-green-100">
                                                <strong>Congratulations!</strong> Your application was approved. We will be in touch shortly to coordinate pickup and finalize the contract.
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </main>
    )
}
