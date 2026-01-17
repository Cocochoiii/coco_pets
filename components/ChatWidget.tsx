'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { MessageCircle, Send, X, Bot, User, Sparkles, Mic, Paperclip } from 'lucide-react'
import toast from 'react-hot-toast'

interface Message {
    id: string
    text: string
    sender: 'user' | 'bot'
    timestamp: Date
    status?: 'sending' | 'sent' | 'error'
}

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Hi! I'm Coco's assistant 🐾 How can I help you today?",
            sender: 'bot',
            timestamp: new Date()
        }
    ])
    const [inputValue, setInputValue] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [isListening, setIsListening] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const buttonControls = useAnimation()

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    useEffect(() => {
        if (!isOpen) {
            const animateButton = async () => {
                await buttonControls.start({
                    scale: [1, 1.1, 1],
                    rotate: [0, 10, -10, 0]
                })
            }
            const interval = setInterval(animateButton, 4000)
            return () => clearInterval(interval)
        }
    }, [isOpen, buttonControls])

    const quickReplies = [
        'What are your rates?',
        'Do you accept puppies?',
        "What's included in boarding?",
        'How do I book?'
    ]

    const getBotReply = (userMessage: string): string => {
        const lowerMessage = userMessage.toLowerCase()

        if (lowerMessage.includes('rate') || lowerMessage.includes('price')) {
            return "Our rates start at $45/day for cats and $55/day for dogs. Extended stays (7+ days) receive a 10% discount! 🏷️"
        } else if (lowerMessage.includes('puppy') || lowerMessage.includes('puppies')) {
            return 'Yes, we love puppies! We accept puppies 12 weeks and older. They get extra playtime and attention! 🐶'
        } else if (lowerMessage.includes('included') || lowerMessage.includes('service')) {
            return 'Our boarding includes: 24/7 care, daily photos/videos, personalized feeding, playtime, basic grooming, and lots of love! ❤️'
        } else if (lowerMessage.includes('book') || lowerMessage.includes('reservation')) {
            return "You can book directly through our calendar above, or call us at (617) 555-0123. We recommend booking at least 24 hours in advance! 📅"
        } else {
            return "Thanks for your message! For detailed inquiries, please call us at (617) 555-0123 or use the contact form. We typically respond within 2 hours! 😊"
        }
    }

    const handleSend = () => {
        if (!inputValue.trim()) return

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date(),
            status: 'sending'
        }

        setMessages(prev => [...prev, userMessage])
        setInputValue('')
        setIsTyping(true)

        setTimeout(() => {
            setMessages(prev =>
                prev.map(msg =>
                    msg.id === userMessage.id ? { ...msg, status: 'sent' } : msg
                )
            )
        }, 300)

        setTimeout(() => {
            const botReply: Message = {
                id: (Date.now() + 1).toString(),
                text: getBotReply(userMessage.text),
                sender: 'bot',
                timestamp: new Date()
            }
            setMessages(prev => [...prev, botReply])
            setIsTyping(false)
        }, 1500)
    }

    const handleVoiceInput = () => {
        setIsListening(!isListening)
        if (!isListening) {
            toast.success('Voice input started!', {
                icon: '🎤',
                style: {
                    background: '#111827',
                    color: '#fff'
                }
            })
        }
    }

    return (
        <>
            {/* Chat Button：手机 & 桌面都在左下角 */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.div
                        className="fixed bottom-4 left-4 md:bottom-6 md:left-6 z-40"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                    >
                        <motion.button
                            animate={buttonControls}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsOpen(true)}
                            className="relative bg-gradient-to-br from-primary-700 to-primary-800 text-white p-4 rounded-2xl shadow-soft-xl hover:shadow-soft-2xl transition-all group"
                        >
                            <MessageCircle className="w-6 h-6" />

                            {/* Ripple */}
                            <motion.div
                                className="absolute inset-0 rounded-2xl"
                                animate={{
                                    scale: [1, 1.5, 1.5],
                                    opacity: [0.3, 0, 0]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity
                                }}
                                style={{
                                    background:
                                        'radial-gradient(circle, rgba(212, 165, 165, 0.4), transparent)'
                                }}
                            />

                            {/* Notification dot */}
                            <motion.div
                                className="absolute -top-1 -right-1 bg-neutral-900 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                            >
                                <Sparkles className="w-3 h-3" />
                            </motion.div>
                        </motion.button>

                        {/* Tooltip：依然贴着左边 */}
                        <motion.div
                            className="absolute bottom-full left-0 mb-2 bg-neutral-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 }}
                        >
                            Need help? Chat with us!
                            <div className="absolute bottom-0 left-4 transform translate-y-full">
                                <div className="border-8 border-transparent border-t-neutral-900" />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Chat Window：mobile bottom sheet，md+ 左下角浮窗 */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="
                            fixed bottom-0 left-0 right-0 z-50
                            w-full h-[80vh] max-h-[700px]
                            bg-white rounded-t-3xl shadow-soft-2xl
                            border-t-2 border-neutral-100
                            flex flex-col overflow-hidden
                            md:bottom-6 md:left-6 md:right-auto
                            md:w-[400px] md:h-[600px] md:max-h-none
                            md:rounded-3xl md:border-2
                        "
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-primary-700 to-primary-800 p-4 text-white relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute inset-0 bg-dot-pattern" />
                            </div>

                            <div className="flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-3">
                                    <motion.div
                                        className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center"
                                        animate={{
                                            rotate: [0, 10, -10, 0],
                                            scale: [1, 1.05, 1]
                                        }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            ease: 'easeInOut'
                                        }}
                                    >
                                        <Bot className="w-6 h-6" />
                                    </motion.div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Coco&apos;s Assistant</h3>
                                        <div className="flex items-center gap-2">
                                            <motion.div
                                                className="w-2 h-2 bg-green-400 rounded-full"
                                                animate={{ scale: [1, 1.2, 1] }}
                                                transition={{ duration: 1, repeat: Infinity }}
                                            />
                                            <p className="text-xs text-primary-100">Online now</p>
                                        </div>
                                    </div>
                                </div>
                                <motion.button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <X className="w-5 h-5" />
                                </motion.button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-neutral-50/50 to-white">
                            {messages.map((message, index) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{
                                        delay: index * 0.05,
                                        type: 'spring',
                                        stiffness: 300,
                                        damping: 30
                                    }}
                                    className={`flex gap-2 ${
                                        message.sender === 'user' ? 'flex-row-reverse' : ''
                                    }`}
                                >
                                    <motion.div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                            message.sender === 'user'
                                                ? 'bg-gradient-to-br from-primary-600 to-primary-700'
                                                : 'bg-white border-2 border-neutral-200'
                                        }`}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {message.sender === 'user' ? (
                                            <User className="w-4 h-4 text-white" />
                                        ) : (
                                            <Bot className="w-4 h-4 text-neutral-600" />
                                        )}
                                    </motion.div>
                                    <div
                                        className={`max-w-[70%] ${
                                            message.sender === 'user' ? 'text-right' : ''
                                        }`}
                                    >
                                        <motion.div
                                            className={`rounded-2xl px-4 py-2.5 ${
                                                message.sender === 'user'
                                                    ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-soft'
                                                    : 'bg-white text-neutral-800 shadow-soft border border-neutral-100'
                                            }`}
                                            whileHover={{ scale: 1.02 }}
                                            transition={{
                                                type: 'spring',
                                                stiffness: 400,
                                                damping: 30
                                            }}
                                        >
                                            {message.text}
                                        </motion.div>
                                        <div className="flex items-center gap-1 mt-1">
                                            <p className="text-xs text-neutral-400">
                                                {message.timestamp.toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                            {message.sender === 'user' && message.status && (
                                                <motion.span
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="text-xs text-neutral-400"
                                                >
                                                    {message.status === 'sent' ? '✓✓' : '✓'}
                                                </motion.span>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex gap-2"
                                >
                                    <div className="w-8 h-8 bg-white border-2 border-neutral-200 rounded-full flex items-center justify-center">
                                        <Bot className="w-4 h-4 text-neutral-600" />
                                    </div>
                                    <div className="bg-white rounded-2xl px-4 py-3 shadow-soft border border-neutral-100">
                                        <div className="flex gap-1">
                                            {[0, 1, 2].map(i => (
                                                <motion.div
                                                    key={i}
                                                    className="w-2 h-2 bg-neutral-400 rounded-full"
                                                    animate={{
                                                        y: [0, -5, 0],
                                                        opacity: [0.4, 1, 0.4]
                                                    }}
                                                    transition={{
                                                        repeat: Infinity,
                                                        duration: 1.5,
                                                        delay: i * 0.1
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Replies */}
                        <AnimatePresence>
                            {messages.length === 1 && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="px-4 py-3 border-t border-neutral-100 bg-white"
                                >
                                    <p className="text-xs text-neutral-500 mb-2 font-medium">
                                        Quick questions:
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {quickReplies.map((reply, index) => (
                                            <motion.button
                                                key={reply}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: index * 0.1 }}
                                                onClick={() => setInputValue(reply)}
                                                className="text-xs px-3 py-1.5 bg-gradient-to-r from-neutral-50 to-neutral-100 hover:from-primary-50 hover:to-primary-100 text-neutral-700 hover:text-primary-700 rounded-full transition-all font-medium border border-neutral-200 hover:border-primary-300"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                {reply}
                                            </motion.button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Input Area */}
                        <div className="p-4 border-t-2 border-neutral-100 bg-white">
                            <div className="flex items-center gap-2">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="p-2 text-neutral-400 hover:text-primary-700 transition-colors"
                                >
                                    <Paperclip className="w-5 h-5" />
                                </motion.button>

                                <motion.button
                                    onClick={handleVoiceInput}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className={`p-2 transition-colors ${
                                        isListening
                                            ? 'text-primary-700 animate-pulse'
                                            : 'text-neutral-400 hover:text-primary-700'
                                    }`}
                                >
                                    <Mic className="w-5 h-5" />
                                </motion.button>

                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={inputValue}
                                    onChange={e => setInputValue(e.target.value)}
                                    onKeyPress={e => e.key === 'Enter' && handleSend()}
                                    placeholder="Type your message..."
                                    className="flex-1 px-4 py-2.5 border-2 border-neutral-200 rounded-full focus:outline-none focus:border-primary-700 focus:shadow-soft-lg transition-all placeholder-neutral-400 text-sm"
                                />

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleSend}
                                    className="p-2.5 bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-full hover:from-primary-700 hover:to-primary-800 transition-all relative overflow-hidden group shadow-soft hover:shadow-soft-lg"
                                >
                                    <Send className="w-5 h-5 relative z-10" />
                                    <motion.div
                                        className="absolute inset-0 bg-white"
                                        initial={{ scale: 0 }}
                                        whileHover={{ scale: 1 }}
                                        transition={{ duration: 0.3 }}
                                        style={{ opacity: 0.2 }}
                                    />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
