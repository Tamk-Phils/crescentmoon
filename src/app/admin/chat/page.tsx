'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Send, User as UserIcon, MessageSquare, ChevronLeft } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

function AdminChatContent() {
    const [conversations, setConversations] = useState<any[]>([])
    const [activeConv, setActiveConv] = useState<any | null>(null)
    const [messages, setMessages] = useState<any[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [adminId, setAdminId] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    const searchParams = useSearchParams()
    const targetUserId = searchParams.get('user')

    const endOfMessagesRef = useRef<HTMLDivElement>(null)
    const supabase = createClient()

    useEffect(() => {
        async function initAdminChat() {
            try {
                // Check for hardcoded admin first
                if (localStorage.getItem('crescent_admin_logged_in') === 'true') {
                    setAdminId('00000000-0000-0000-0000-000000000000')
                } else {
                    const { data: { session } } = await supabase.auth.getSession()
                    if (!session) return
                    setAdminId(session.user.id)
                }

                // Fetch all conversations with users
                const { data: convs, error } = await supabase
                    .from('conversations')
                    .select(`
                        id,
                        created_at,
                        users:conversations_user_id_fkey ( id, full_name, email )
                    `)
                    .order('created_at', { ascending: false })

                if (error) {
                    console.error("Supabase Error (Fetch Convs):", error)
                    throw error
                }

                setConversations(convs || [])
                if (targetUserId) {
                    const existingConv = convs?.find((c: any) => c.users?.id === targetUserId || c.user_id === targetUserId)
                    if (existingConv) {
                        setActiveConv(existingConv)
                    } else {
                        // Create new conversation
                        const { data: newConv, error: createError } = await supabase
                            .from('conversations')
                            .insert({ user_id: targetUserId })
                            .select(`
                                id,
                                created_at,
                                users:conversations_user_id_fkey ( id, full_name, email )
                            `)
                            .maybeSingle()

                        if (createError) {
                            console.error("Error creating conversation:", createError)
                            // Fallback: try to find it again
                            const { data: retry } = await supabase
                                .from('conversations')
                                .select(`
                                    id,
                                    created_at,
                                    users:conversations_user_id_fkey ( id, full_name, email )
                                `)
                                .eq('user_id', targetUserId)
                            if (retry && retry.length > 0) setActiveConv(retry[0])
                        } else if (newConv) {
                            setConversations(prev => [newConv, ...prev])
                            setActiveConv(newConv)
                        }
                    }
                } else if (convs && convs.length > 0) {
                    setActiveConv(convs[0])
                }
            } catch (err: any) {
                console.error('Critical Admin Chat Init Error:', err)
            } finally {
                setLoading(false)
            }
        }

        initAdminChat()
    }, [])

    useEffect(() => {
        if (!activeConv) return

        async function fetchMessages() {
            const { data: msgs } = await supabase
                .from('messages')
                .select('*')
                .eq('conversation_id', activeConv.id)
                .order('created_at', { ascending: true })

            setMessages(msgs || [])

            // Subscribe
            const channel = supabase
                .channel(`admin_room:${activeConv.id}`)
                .on('postgres_changes', {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `conversation_id=eq.${activeConv.id}`
                }, (payload) => {
                    setMessages(prev => {
                        if (prev.some(m => m.id === payload.new.id)) return prev;
                        return [...prev, payload.new];
                    })
                })
                .subscribe()

            return () => {
                supabase.removeChannel(channel)
            }
        }

        fetchMessages()
    }, [activeConv])

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim() || !activeConv || !adminId) return

        const msgText = newMessage.trim()
        setNewMessage('') // Optimistic clear

        // Optimistic Update
        const tempId = 'temp-' + Date.now()
        const optimisticMsg = {
            id: tempId,
            conversation_id: activeConv.id,
            sender_id: adminId,
            content: msgText,
            created_at: new Date().toISOString()
        }
        setMessages(prev => [...prev, optimisticMsg])

        const { data, error } = await supabase.from('messages').insert({
            conversation_id: activeConv.id,
            sender_id: adminId,
            content: msgText
        }).select().single()

        if (error) {
            console.error("Admin: Failed to send message:", error)

            // Remove optimistic message on error
            setMessages(prev => prev.filter(m => m.id !== tempId))

            if (error.code === '23503') {
                console.log("Stale conversation detected in admin chat, reloading...")
                window.location.reload()
                return
            }
            alert("Failed to send: " + error.message)
            setNewMessage(msgText)
        } else if (data) {
            // Replace optimistic message with the real one from DB
            setMessages(prev => prev.map(m => m.id === tempId ? data : m))
        }
    }

    const [showMessages, setShowMessages] = useState(false)

    useEffect(() => {
        if (activeConv && window.innerWidth < 1024) {
            setShowMessages(true)
        }
    }, [activeConv])

    if (loading) return <div className="p-8 text-gray-500 font-serif">Loading chat system...</div>

    return (
        <div className="h-[calc(100vh-140px)] md:h-[calc(100vh-100px)] flex flex-col lg:flex-row gap-6">
            {/* Conversations List */}
            <div className={`w-full lg:w-1/3 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col transition-all duration-300 ${showMessages ? 'hidden lg:flex' : 'flex'}`}>
                <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="font-serif text-lg text-primary-950 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-primary-600" />
                        Conversations
                    </h2>
                </div>
                <div className="flex-1 overflow-y-auto w-full divide-y divide-gray-50">
                    {conversations.map((conv) => (
                        <div
                            key={conv.id}
                            onClick={() => {
                                setActiveConv(conv)
                                if (window.innerWidth < 1024) setShowMessages(true)
                            }}
                            className={`p-5 cursor-pointer transition-all ${activeConv?.id === conv.id
                                ? 'bg-primary-50 border-l-4 border-l-primary-600'
                                : 'hover:bg-gray-50 border-l-4 border-l-transparent'
                                }`}
                        >
                            <h3 className="font-semibold text-gray-900 truncate">{conv.users?.full_name || 'Anonymous User'}</h3>
                            <p className="text-xs text-gray-500 truncate mt-1">{conv.users?.email}</p>
                        </div>
                    ))}
                    {conversations.length === 0 && (
                        <div className="p-10 text-center text-gray-400 text-sm italic">
                            No conversations found.
                        </div>
                    )}
                </div>
            </div>

            {/* Message Area */}
            <div className={`w-full lg:w-2/3 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col transition-all duration-300 ${!showMessages ? 'hidden lg:flex' : 'flex'}`}>
                {activeConv ? (
                    <>
                        {/* Area Header */}
                        <div className="p-4 md:p-5 border-b border-gray-100 bg-primary-50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setShowMessages(false)}
                                    className="lg:hidden p-2 -ml-2 hover:bg-white/50 rounded-full transition-colors text-primary-700"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-primary-200 rounded-full flex items-center justify-center text-primary-700 shadow-sm">
                                    <UserIcon className="w-5 h-5 md:w-6 md:h-6" />
                                </div>
                                <div className="overflow-hidden">
                                    <h2 className="font-bold text-primary-950 truncate max-w-[150px] md:max-w-none">
                                        {activeConv.users?.full_name || 'Anonymous User'}
                                    </h2>
                                    <p className="text-[10px] md:text-xs text-primary-600 truncate">{activeConv.users?.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Messages List */}
                        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50/30 flex flex-col gap-4">
                            {messages.length === 0 ? (
                                <div className="m-auto text-center text-gray-400 p-6 italic bg-white rounded-xl shadow-inner border border-gray-100">
                                    <p>Start a new conversation with this user.</p>
                                </div>
                            ) : (
                                messages.map((msg, i) => {
                                    const isAdmin = msg.sender_id === adminId
                                    return (
                                        <div key={i} className={`flex w-full ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 shadow-sm ${isAdmin
                                                ? 'bg-primary-700 text-white rounded-br-none'
                                                : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                                                }`}>
                                                <p className="leading-relaxed text-sm md:text-base">{msg.content}</p>
                                                <p className={`text-[10px] mt-2 opacity-60 ${isAdmin ? 'text-right' : 'text-left'}`}>
                                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                            <div ref={endOfMessagesRef} />
                        </div>

                        {/* Message Input */}
                        <div className="p-4 md:p-6 bg-white border-t border-gray-100">
                            <form onSubmit={handleSendMessage} className="flex gap-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-grow px-5 py-3 md:py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all text-sm md:text-base shadow-inner"
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="bg-primary-700 hover:bg-primary-600 text-white rounded-2xl px-5 md:px-6 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg active:scale-95"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="m-auto text-center text-gray-400 p-8 flex flex-col items-center gap-4">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 shadow-inner">
                            <MessageSquare className="w-10 h-10 opacity-20" />
                        </div>
                        <p className="font-serif text-lg">Select a conversation to begin</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default function AdminChatPage() {
    return (
        <Suspense fallback={<div className="p-8 text-gray-500">Loading chat system...</div>}>
            <AdminChatContent />
        </Suspense>
    )
}
