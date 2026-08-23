'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pjwgghktbtjidubqicml.supabase.co'
const supabaseKey = 'sb_publishable_tn7eBYVm9Qw8gE0kCqGndw_wlG1T8W8'

const supabase = createClient(supabaseUrl, supabaseKey)

export default function Home() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadMessages()
    const interval = setInterval(loadMessages, 3000)
    return () => clearInterval(interval)
  }, [])

  async function loadMessages() {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true })
      
      if (error) {
        console.error('Error cargando:', error)
        setError('Error al cargar mensajes')
      } else {
        setMessages(data || [])
        setError(null)
      }
    } catch (err) {
      setError('Error de conexión')
    }
  }

  async function sendMessage() {
    if (!input.trim()) {
      alert('Escribe un mensaje primero')
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          from_user: true,
          content: input,
          created_at: new Date().toISOString()
        }])
      
      if (error) {
        console.error('Error enviando:', error)
        alert('Error al enviar: ' + error.message)
      } else {
        setInput('')
        await loadMessages()
      }
    } catch (err) {
      alert('Error de conexión: ' + err.message)
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-2">🤖 Nexus IA</h1>
        <p className="text-gray-300 text-center mb-6">Chat en tiempo real</p>
        
        {error && (
          <div className="bg-red-500 text-white p-3 rounded-lg mb-4 text-center">
            ️ {error}
          </div>
        )}
        
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-4 h-96 overflow-y-auto">
          {messages.length === 0 ? (
            <p className="text-gray-400 text-center mt-20">No hay mensajes aún</p>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`mb-3 ${msg.from_user ? 'text-right' : 'text-left'}`}>
                <span className={`inline-block px-4 py-2 rounded-lg ${
                  msg.from_user ? 'bg-purple-600 text-white' : 'bg-gray-700 text-white'
                }`}>
                  {msg.content}
                </span>
              </div>
            ))
          )}
        </div>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Escribe un mensaje..."
            className="flex-1 px-4 py-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:border-purple-500"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? '...' : 'Enviar'}
          </button>
        </div>
      </div>
    </div>
  )
}
