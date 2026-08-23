'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

// Reemplaza la clave de abajo con la tuya real
const supabaseUrl = 'https://pjwgghktbtjidubqicml.supabase.co'
const supabaseKey = 'sb_publishable_tn7eBYVm9Qw8gE0kCqGndw_wlG1T8W8' 

const supabase = createClient(supabaseUrl, supabaseKey)

export default function Home() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

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
    if (data) setMessages(data)
  }

  async function sendMessage() {
    if (!input.trim()) return
    setLoading(true)
    const { error } = await supabase
      .from('messages')
      .insert([{ from_user: true, content: input, created_at: new Date().toISOString() }])
    if (!error) setInput('')
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#111', padding: '20px', color: 'white' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', background: '#222', borderRadius: '15px', height: '90vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '15px', borderBottom: '1px solid #333', textAlign: 'center' }}>
          <h2 style={{ margin: 0 }}>🤖 Nexus IA Chat</h2>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', padding: '15px' }}>
          {messages.map((msg) => (
            <div key={msg.id} style={{ marginBottom: '10px', display: 'flex', justifyContent: msg.from_user ? 'flex-end' : 'flex-start' }}>
              <div style={{ maxWidth: '80%', padding: '10px 15px', borderRadius: '15px', background: msg.from_user ? '#007bff' : '#333' }}>
                {msg.image_url && <img src={msg.image_url} style={{ maxWidth: '100%', borderRadius: '10px', marginBottom: '5px' }} />}
                <p style={{ margin: 0 }}>{msg.content}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: '15px', borderTop: '1px solid #333', display: 'flex', gap: '10px' }}>
          <input 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="Escribe un mensaje..." 
            style={{ flex: 1, padding: '10px', borderRadius: '20px', border: 'none', background: '#333', color: 'white' }}
          />
          <button onClick={sendMessage} disabled={loading} style={{ padding: '10px 20px', borderRadius: '20px', border: 'none', background: '#007bff', color: 'white' }}>
            {loading ? '...' : 'Enviar'}
          </button>
        </div>
      </div>
    </div>
  )
                  }
