'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

// Reemplaza con TUS claves
const supabaseUrl = 'https://pjwgghktbtjidubqicml.supabase.co'
const supabaseKey = 'AQUI_PEGA_TU_PUBLISHABLE_KEY_COMPLETA'

const supabase = createClient(supabaseUrl, supabaseKey)

export default function Home() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    loadMessages()
    const interval = setInterval(loadMessages, 3000)
    return () => clearInterval(interval)
  }, [])

  async function loadMessages() {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true })
    
    if (data) {
      setMessages(data)
      window.scrollTo(0, document.body.scrollHeight)
    }
  }

  async function sendMessage() {
    if (!input.trim()) return
    
    setLoading(true)
    const { error } = await supabase
      .from('messages')
      .insert([{
        from_user: true,
        content: input,
        created_at: new Date().toISOString()
      }])
    
    if (!error) {
      setInput('')
      setIsTyping(true)
    }
    setLoading(false)
  }

  function formatDate(dateString) {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now - date
    
    if (diff < 60000) return 'Ahora'
    if (diff < 3600000) return `Hace ${Math.floor(diff/60000)}m`
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-3xl shadow-2xl mb-4 transform hover:scale-110 transition-transform duration-300">
            <span className="text-5xl">🤖</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            Nexus IA
          </h1>
          <p className="text-gray-400 text-lg">Sistema de Inteligencia Artificial Avanzado</p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-green-400 text-sm">En línea • Tiempo real</span>
          </div>
        </div>

        {/* Chat Container */}
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Messages Area */}
          <div className="h-[600px] overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mb-4 animate-pulse">
                  <span className="text-4xl"></span>
                </div>
                <p className="text-xl font-semibold mb-2">¡Bienvenido a Nexus IA!</p>
                <p className="text-sm text-center max-w-md">
                  La IA te enviará reportes automáticos con capturas de pantalla.<br/>
                  Escribe un mensaje para comenzar.
                </p>
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={msg.id}
                className={`flex ${msg.from_user ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`max-w-[80%] rounded-2xl px-6 py-4 shadow-lg transform hover:scale-105 transition-transform duration-200 ${
                  msg.from_user 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-md' 
                    : 'bg-white/20 backdrop-blur-md text-white rounded-bl-md border border-white/10'
                }`}>
                  {msg.image_url && (
                    <div className="mb-3 rounded-xl overflow-hidden">
                      <img 
                        src={msg.image_url} 
                        alt="Captura" 
                        className="w-full max-w-sm object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}
                  {msg.content && (
                    <p className="text-base leading-relaxed">{msg.content}</p>
                  )}
                  <span className="text-xs opacity-60 mt-2 block">
                    {formatDate(msg.created_at)}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/10">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-white/20 p-6 bg-black/20 backdrop-blur-md">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Escribe un mensaje a Nexus IA..."
                className="flex-1 px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-md transition-all duration-300"
              />
              <button
                onClick={sendMessage}
                disabled={loading}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span className="text-xl">📤</span>
                )}
              </button>
            </div>
            <p className="text-center text-gray-400 text-xs mt-3">
              Presiona Enter para enviar • Los mensajes se sincronizan en tiempo real
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-400 text-sm">
          <p>Powered by Nexus IA • Conectado a Supabase</p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thumb-purple-500::-webkit-scrollbar-thumb {
          background: #a855f7;
          border-radius: 10px;
        }
        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  )
}
