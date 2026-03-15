'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Navbar } from '@/components/layout/navbar'
import { Send, User as UserIcon } from 'lucide-react'

export default function ChatPage() {
    const [messages, setMessages] = useState<any[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [conversationId, setConversationId] = useState<string | null>(null)
    const [userId, setUserId] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    const endOfMessagesRef = useRef<HTMLDivElement>(null)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        async function initChat() {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                router.push('/login')
                return
            }
            setUserId(session.user.id)

            // Find or create conversation for this user
            let { data: conv, error: fetchError } = await supabase
                .from('conversations')
                .select('*')
                .eq('user_id', session.user.id)
                .maybeSingle()

            if (fetchError) {
                console.error("Error fetching conversation:", fetchError)
            }

            if (!conv) {
                const { data: newConv, error: createError } = await supabase
                    .from('conversations')
                    .insert({ user_id: session.user.id })
                    .select()
                    .maybeSingle()

                if (createError) {
                    console.error("Error creating conversation:", createError)
                    // If creation fails (e.g. unique constraint), try to fetch again
                    const { data: retryConv } = await supabase
                        .from('conversations')
                        .select('*')
                        .eq('user_id', session.user.id)
                        .maybeSingle()
                    conv = retryConv
                } else {
                    conv = newConv
                }
            }

            if (conv) {
                setConversationId(conv.id)

                // Fetch existing messages
                const { data: msgs } = await supabase
                    .from('messages')
                    .select('*')
                    .eq('conversation_id', conv.id)
                    .order('created_at', { ascending: true })

                setMessages(msgs || [])

                // Subscribe to real-time new messages
                const channel = supabase
                    .channel(`room:${conv.id}`)
                    .on('postgres_changes', {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'messages',
                        filter: `conversation_id=eq.${conv.id}`
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
            setLoading(false)
        }

        initChat()
    }, [router])

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim() || !conversationId || !userId) return

        const msgText = newMessage.trim()
        setNewMessage('') // Optimistic clear

        // Optimistic Update
        const tempId = 'temp-' + Date.now()
        const optimisticMsg = {
            id: tempId,
            conversation_id: conversationId,
            sender_id: userId,
            content: msgText,
            created_at: new Date().toISOString()
        }
        setMessages(prev => [...prev, optimisticMsg])

        const { data, error } = await supabase.from('messages').insert({
            conversation_id: conversationId,
            sender_id: userId,
            content: msgText
        }).select().single()

        if (error) {
            console.error("Failed to send message:", error)

            // Remove optimistic message on error
            setMessages(prev => prev.filter(m => m.id !== tempId))

            // Handle foreign key violation (23503) from stale ID
            if (error.code === '23503') {
                console.log("Stale conversation ID detected, re-initializing...")
                window.location.reload()
                return
            }

            alert("Failed to send message: " + error.message)
            setNewMessage(msgText) // restore message
        } else if (data) {
            // Replace optimistic message with the real one from DB (to get the real ID)
            setMessages(prev => prev.map(m => m.id === tempId ? data : m))

            // Get user info for notification
            const { data: userData } = await supabase.from('users').select('email, full_name').eq('id', userId).single()

            // Notify admin of new message
            fetch('/api/notify-admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'chat',
                    data: {
                        content: msgText,
                        senderName: userData?.full_name || 'Anonymous User',
                        senderEmail: userData?.email || ''
                    }
                })
            }).catch(e => console.error("Chat notification failed:", e))
        }
    }

    if (loading && !userId) {
        return <div className="min-h-screen pt-32 text-center text-gray-500 bg-[#fdfbf7]">Connecting to secure chat...</div>
    }

    return (
        <main className="min-h-screen w-full flex flex-col bg-[#e6e2f0]">
            <div className="bg-primary-900"><Navbar /></div>

            <div className="flex-grow max-w-4xl w-full mx-auto p-4 md:p-6 flex flex-col h-[calc(100vh-100px)]">
                <div className="bg-white rounded-[2rem] shadow-xl flex flex-col flex-grow overflow-hidden border border-primary-100">

                    <div className="bg-primary-50 p-6 border-b border-primary-100 flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary-200 rounded-full flex items-center justify-center text-primary-700">
                            <UserIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-serif text-primary-950">Ellie (Breeder)</h2>
                            <p className="text-sm text-green-600 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span> Online
                            </p>
                        </div>
                    </div>

                    <div className="flex-grow p-6 overflow-y-auto bg-gray-50/50 flex flex-col gap-4">
                        {messages.length === 0 ? (
                            <div className="m-auto text-center text-gray-400 p-6">
                                <p className="mb-2">Send a message to start the conversation.</p>
                                <p className="text-sm">We'll get back to you as soon as possible!</p>
                            </div>
                        ) : (
                            messages.map((msg, i) => {
                                const isMe = msg.sender_id === userId
                                return (
                                    <div key={i} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[75%] rounded-2xl p-4 ${isMe
                                            ? 'bg-primary-600 text-white rounded-br-none'
                                            : 'bg-white text-gray-800 border border-gray-100 shadow-sm rounded-bl-none'
                                            }`}>
                                            <p className="leading-relaxed">{msg.content}</p>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                        <div ref={endOfMessagesRef} />
                    </div>

                    <div className="p-4 bg-white border-t border-gray-100">
                        <form onSubmit={handleSendMessage} className="flex gap-2">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-grow px-6 py-4 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-400 transition-shadow"
                            />
                            <button
                                type="submit"
                                disabled={!newMessage.trim()}
                                className="bg-primary-700 hover:bg-primary-600 text-white rounded-full p-4 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                aria-label="Send message"
                            >
                                <Send className="w-5 h-5 -ml-1" />
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </main>
    )
}
