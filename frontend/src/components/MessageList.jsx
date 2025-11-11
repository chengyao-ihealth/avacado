import React from 'react'
import Message from './Message'
import './MessageList.css'

function MessageList({ messages, loading }) {
  return (
    <div className="message-list">
      {messages.length === 0 && !loading && (
        <div className="empty-state">
          <span className="empty-emoji">🥑</span>
          <p>开始和 Avacado 聊天吧！</p>
          <p className="empty-hint">我会帮你记录每天的饮食、症状、运动、心情和睡眠情况</p>
        </div>
      )}
      
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
      
      {loading && (
        <div className="loading-message">
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      )}
    </div>
  )
}

export default MessageList

