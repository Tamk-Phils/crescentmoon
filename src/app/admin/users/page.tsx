'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Trash2, UserCog, MessageSquare } from 'lucide-react'

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        fetchUsers()
    }, [])

    async function fetchUsers() {
        const { data } = await supabase.from('users').select('*').order('created_at', { ascending: false })
        setUsers(data || [])
        setLoading(false)
    }

    async function toggleRole(id: string, currentRole: string) {
        if (!confirm(`Are you sure you want to change this user's role?`)) return
        const newRole = currentRole === 'admin' ? 'user' : 'admin'
        await supabase.from('users').update({ role: newRole }).eq('id', id)
        fetchUsers()
    }

    async function handleChatWithUser(userId: string) {
        // Find or create conversation
        let { data: conv, error: fetchError } = await supabase
            .from('conversations')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle()

        if (!conv) {
            const { data: newConv, error: createError } = await supabase
                .from('conversations')
                .insert({ user_id: userId })
                .select()
                .maybeSingle()

            if (createError) {
                // If creation fails, try fetching again
                const { data: retryConv } = await supabase
                    .from('conversations')
                    .select('*')
                    .eq('user_id', userId)
                    .maybeSingle()
                conv = retryConv
            } else {
                conv = newConv
            }
        }

        router.push(`/admin/chat?user=${userId}`)
    }

    async function deleteUser(id: string) {
        if (!confirm('WARNING: Are you absolutely sure? This will delete their profile from the database. Supabase Auth must be deleted separately in the dashboard.')) return
        await supabase.from('users').delete().eq('id', id)
        fetchUsers()
    }

    return (
        <div>
            <div className="mb-8 flex items-center gap-3">
                <UserCog className="w-8 h-8 text-primary-600" />
                <div>
                    <h1 className="text-3xl font-serif text-primary-950">Registered Users</h1>
                    <p className="text-gray-500 mt-1">Manage accounts and permissions.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-400">Loading users...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[700px]">
                            <thead className="bg-gray-50 text-gray-500 text-sm">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Name</th>
                                    <th className="px-6 py-4 font-medium">Email</th>
                                    <th className="px-6 py-4 font-medium">Role</th>
                                    <th className="px-6 py-4 font-medium">Joined</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{user.full_name || 'N/A'}</td>
                                        <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium uppercase ${user.role === 'admin' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-1">
                                                <button
                                                    onClick={() => toggleRole(user.id, user.role)}
                                                    className="text-primary-600 hover:text-primary-800 transition-colors font-medium px-2 py-1 rounded hover:bg-primary-50"
                                                >
                                                    {user.role === 'admin' ? 'Revoke' : 'Promote'}
                                                </button>
                                                <button
                                                    onClick={() => handleChatWithUser(user.id)}
                                                    className="p-2 text-gray-400 hover:text-primary-600 rounded transition-colors"
                                                    title="Chat with Profile"
                                                >
                                                    <MessageSquare className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => deleteUser(user.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 rounded transition-colors"
                                                    title="Delete Profile"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
