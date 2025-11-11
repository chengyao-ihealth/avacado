import React, { useState, useRef, useEffect } from 'react'
import './MessageInput.css'

function MessageInput({ onSendMessage, disabled }) {
  const [message, setMessage] = useState('')
  const textareaRef = useRef(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim() && !disabled) {
      onSendMessage(message.trim())
      setMessage('')
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="message-input-container">
      <form onSubmit={handleSubmit} className="message-input-form">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="输入消息... (按 Enter 发送，Shift+Enter 换行)"
          className="message-input"
          rows="1"
          disabled={disabled}
        />
        <button 
          type="submit" 
          className="send-button"
          disabled={disabled || !message.trim()}
        >
          <span className="send-icon">🥑</span>
        </button>
      </form>
    </div>
  )
}

export default MessageInput

