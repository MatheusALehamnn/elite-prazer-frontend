
import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Send, X } from "lucide-react"

export function ChatWindow({ isOpen, onClose, companion }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "companion",
      text: "Olá! Como posso ajudar você hoje?",
      timestamp: new Date(),
    },
  ])
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const userMessage = {
      id: messages.length + 1,
      sender: "user",
      text: newMessage,
      timestamp: new Date(),
    }

    setMessages([...messages, userMessage])
    setNewMessage("")

    // Simulate companion response
    setTimeout(() => {
      const companionMessage = {
        id: messages.length + 2,
        sender: "companion",
        text: "Obrigada pelo seu contato! Em breve retornarei sua mensagem.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, companionMessage])
    }, 1000)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-4 right-4 w-96 h-[600px] glass-card rounded-2xl overflow-hidden shadow-2xl"
        >
          {/* Chat Header */}
          <div className="p-4 premium-gradient flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img  alt={`Foto de ${companion?.name || 'Acompanhante'}`} className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1680049118554-b2e40e2eef36" />
              </div>
              <div>
                <h3 className="font-semibold text-white">{companion?.name || "Acompanhante"}</h3>
                <p className="text-xs text-white/80">Online agora</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-white/80"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Chat Messages */}
          <ScrollArea className="h-[calc(100%-140px)] p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-3 ${
                      message.sender === "user"
                        ? "bg-primary text-white"
                        : "bg-secondary"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {format(message.timestamp, "HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t bg-background">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1 rounded-full px-4 py-2 bg-secondary border-none focus:ring-2 focus:ring-primary focus:outline-none"
              />
              <Button
                type="submit"
                size="icon"
                className="rounded-full premium-gradient text-white"
                disabled={!newMessage.trim()}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
