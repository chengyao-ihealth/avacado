import React from 'react'
import './Header.css'

function Header({ patient, onReset }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-section">
          <span className="logo-emoji">🥑</span>
          <h1 className="logo-text">Avacado</h1>
          <span className="logo-subtitle">健康聊天助手</span>
        </div>
        {patient && (
          <div className="patient-info">
            <span className="patient-name">👤 {patient.name}</span>
            <button className="reset-btn" onClick={onReset}>
              重新设置
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header

