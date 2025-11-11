import React from 'react'
import './Message.css'

function Message({ message }) {
  const isUser = message.userMessage && !message.botMessage
  const isBot = message.botMessage && !message.userMessage

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  if (isUser) {
    return (
      <div className="message message-user">
        <div className="message-content user-content">
          <p>{message.userMessage}</p>
          <span className="message-time">{formatTime(message.timestamp)}</span>
        </div>
        <div className="message-avatar user-avatar">👤</div>
      </div>
    )
  }

  if (isBot) {
    return (
      <div className="message message-bot">
        <div className="message-avatar bot-avatar">🥑</div>
        <div className="message-content bot-content">
          <p>{message.botMessage}</p>
          <span className="message-time">{formatTime(message.timestamp)}</span>
        </div>
      </div>
    )
  }

  // Combined message (both user and bot)
  return (
    <>
      {message.userMessage && (
        <div className="message message-user">
          <div className="message-content user-content">
            <p>{message.userMessage}</p>
            <span className="message-time">{formatTime(message.timestamp)}</span>
          </div>
          <div className="message-avatar user-avatar">👤</div>
        </div>
      )}
      {message.botMessage && (
        <div className="message message-bot">
          <div className="message-avatar bot-avatar">🥑</div>
          <div className="message-content bot-content">
            <p>{message.botMessage}</p>
            <span className="message-time">{formatTime(message.timestamp)}</span>
          </div>
        </div>
      )}
    </>
  )
}

export default Message

