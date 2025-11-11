import React, { useState, useEffect, useRef } from 'react'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import DailyLogSummary from './DailyLogSummary'
import { storage } from '../services/storage'
import { generateChatbotResponse, checkProactiveGreeting } from '../services/chatbot'
import { getToday } from '../services/storage'
import './ChatInterface.css'

function ChatInterface({ patientId, patient }) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [todayLog, setTodayLog] = useState({})
  const [missingFields, setMissingFields] = useState([])
  const messagesEndRef = useRef(null)
  const [hasCheckedGreeting, setHasCheckedGreeting] = useState(false)

  useEffect(() => {
    if (patientId) {
      loadConversations()
      loadTodayLog()
    }
  }, [patientId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadConversations = () => {
    try {
      const conversations = storage.getConversations(patientId)
      setMessages(conversations)
      
      // Check for proactive greeting after loading conversations
      if (conversations.length === 0 && !hasCheckedGreeting) {
        checkProactiveGreetingHandler()
      } else {
        setHasCheckedGreeting(true)
      }
    } catch (error) {
      console.error('Error loading conversations:', error)
      if (!hasCheckedGreeting) {
        checkProactiveGreetingHandler()
      }
    }
  }

  const loadTodayLog = () => {
    try {
      const log = storage.getTodayLog(patientId)
      const missing = storage.checkMissingData(patientId)
      setTodayLog(log)
      setMissingFields(missing)
    } catch (error) {
      console.error('Error loading today log:', error)
    }
  }

  const checkProactiveGreetingHandler = () => {
    if (hasCheckedGreeting || !patientId) return
    
    try {
      const missing = storage.checkMissingData(patientId)
      const greeting = checkProactiveGreeting(missing)
      if (greeting.shouldGreet) {
        addBotMessage(greeting.message, 'greeting')
      }
      setHasCheckedGreeting(true)
    } catch (error) {
      console.error('Error checking greeting:', error)
      setHasCheckedGreeting(true)
    }
  }

  const addBotMessage = (text, type = 'general') => {
    const newMessage = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      userMessage: '',
      botMessage: text,
      type: type
    }
    setMessages(prev => {
      const updated = [...prev, newMessage]
      // Save to storage
      storage.saveConversation(patientId, newMessage)
      return updated
    })
  }

  const handleSendMessage = (message) => {
    if (!message.trim()) return

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      userMessage: message,
      botMessage: '',
      type: 'user'
    }
    setMessages(prev => {
      const updated = [...prev, userMessage]
      storage.saveConversation(patientId, userMessage)
      return updated
    })
    setLoading(true)

    // Process message with a small delay to show loading state
    setTimeout(() => {
      try {
        const logs = storage.getLogs()
        const missing = storage.checkMissingData(patientId)
        
        // Get last conversation for context
        const conversations = storage.getConversations(patientId)
        const lastConversation = conversations.length > 0 
          ? conversations[conversations.length - 1] 
          : null
        
        // Check context - if last bot message was asking about a field
        let contextField = null
        if (lastConversation && lastConversation.botMessage) {
          const lastBotMsg = lastConversation.botMessage
          const fieldKeywords = {
            food: ['饮食', '吃', 'food', 'meal', '早餐', '午餐', '晚餐'],
            symptom: ['症状', '身体', '不舒服', 'symptom', '感觉怎么样', '有没有'],
            exercise: ['运动', 'exercise', '活动', '锻炼'],
            mood: ['心情', 'mood', '感觉如何', '情绪'],
            sleep: ['睡眠', '睡觉', 'sleep', '睡了', '小时']
          }
          
          for (const [field, keywords] of Object.entries(fieldKeywords)) {
            if (keywords.some(kw => lastBotMsg.includes(kw)) && missing.includes(field)) {
              contextField = field
              break
            }
          }
        }
        
        // Generate response
        const response = generateChatbotResponse(message, patient, logs, missing)
        
        // Determine which field to save data to
        let fieldToSave = null
        const lowerMessage = message.toLowerCase()
        const isLikelyResponse = !lowerMessage.includes('hello') && 
                                !lowerMessage.includes('hi') && 
                                !lowerMessage.includes('help') && 
                                !lowerMessage.includes('帮助') &&
                                !lowerMessage.includes('谢谢') &&
                                !lowerMessage.includes('thank') &&
                                message.length > 2
        
        if (response.extractData && response.field) {
          fieldToSave = response.field
        } else if (contextField && isLikelyResponse) {
          fieldToSave = contextField
        } else if (response.suggestedField && isLikelyResponse && missing.includes(response.suggestedField)) {
          fieldToSave = response.suggestedField
        }
        
        // Save data if we determined a field
        if (fieldToSave) {
          const today = getToday()
          storage.saveLog(patientId, today, fieldToSave, message)
          if (!response.extractData) {
            response.extractData = true
            response.field = fieldToSave
          }
        }
        
        // Add bot response
        const botMessage = {
          id: (Date.now() + 1).toString(),
          timestamp: new Date().toISOString(),
          userMessage: '',
          botMessage: response.message,
          type: response.type || 'general'
        }
        setMessages(prev => {
          const updated = [...prev, botMessage]
          storage.saveConversation(patientId, botMessage)
          return updated
        })

        // Reload today's log to update missing fields
        loadTodayLog()
      } catch (error) {
        console.error('Error processing message:', error)
        addBotMessage('抱歉，我遇到了一些问题。请稍后再试。', 'error')
      } finally {
        setLoading(false)
      }
    }, 300) // Small delay for better UX
  }

  const handleSaveLog = (field, value) => {
    try {
      const today = getToday()
      storage.saveLog(patientId, today, field, value)
      loadTodayLog()
    } catch (error) {
      console.error('Error saving log:', error)
    }
  }

  return (
    <div className="chat-interface">
      <DailyLogSummary 
        todayLog={todayLog} 
        missingFields={missingFields}
        onSaveLog={handleSaveLog}
      />
      
      <div className="chat-container">
        <MessageList messages={messages} loading={loading} />
        <div ref={messagesEndRef} />
        <MessageInput onSendMessage={handleSendMessage} disabled={loading} />
      </div>
    </div>
  )
}

export default ChatInterface
