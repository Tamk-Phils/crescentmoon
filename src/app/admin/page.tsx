'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Dog, Users, MessageSquare, ListTodo } from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({
        totalPuppies: 0,
        totalUsers: 0,
        pendingRequests: 0,
        activeChats: 0
    })
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        async function fetchStats() {
            const [puppiesCount, usersCount, requestsCount, chatsCount] = await Promise.all([
                supabase.from('puppies').select('id', { count: 'exact', head: true }),
                supabase.from('users').select('id', { count: 'exact', head: true }),
                supabase.from('adoption_requests').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
                supabase.from('conversations').select('id', { count: 'exact', head: true })
            ])

            setStats({
                totalPuppies: puppiesCount.count || 0,
                totalUsers: usersCount.count || 0,
                pendingRequests: requestsCount.count || 0,
                activeChats: chatsCount.count || 0
            })
            setLoading(false)
        }

        fetchStats()
    }, [])

    if (loading) return <div className="text-gray-500">Loading statistics...</div>

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-serif text-primary-950">Dashboard Overview</h1>
                <p className="text-gray-500 mt-1">Welcome back. Here's what's happening today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center justify-center">
                    <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-4">
                        <Dog className="w-6 h-6" />
                    </div>
                    <h3 className="text-3xl font-medium text-gray-900 mb-1">{stats.totalPuppies}</h3>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Puppies</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center justify-center">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                        <Users className="w-6 h-6" />
                    </div>
                    <h3 className="text-3xl font-medium text-gray-900 mb-1">{stats.totalUsers}</h3>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Registered Users</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center justify-center relative overflow-hidden">
                    <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4 relative z-10">
                        <ListTodo className="w-6 h-6" />
                        {stats.pendingRequests > 0 && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>}
                    </div>
                    <h3 className="text-3xl font-medium text-gray-900 mb-1 relative z-10">{stats.pendingRequests}</h3>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider relative z-10">Pending Requests</p>
                    {stats.pendingRequests > 0 && <div className="absolute inset-0 bg-orange-50/50 z-0"></div>}
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center justify-center">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                        <MessageSquare className="w-6 h-6" />
                    </div>
                    <h3 className="text-3xl font-medium text-gray-900 mb-1">{stats.activeChats}</h3>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Active Chats</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center max-w-2xl mx-auto">
                <h2 className="font-serif text-2xl text-primary-950 mb-4">Quick Actions</h2>
                <div className="flex flex-wrap justify-center gap-4">
                    <Link href="/admin/puppies/new" className="bg-primary-700 hover:bg-primary-600 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-sm">
                        Add New Puppy
                    </Link>
                    <Link href="/admin/requests" className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 font-medium py-3 px-6 rounded-lg transition-colors shadow-sm">
                        Review Applications
                    </Link>
                    <Link href="/admin/chat" className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 font-medium py-3 px-6 rounded-lg transition-colors shadow-sm">
                        Check Messages
                    </Link>
                </div>
            </div>
        </div>
    )
}
