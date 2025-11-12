import React, { useState } from 'react'
import { storage } from '../services/storage'
import './PatientSetup.css'

function PatientSetup({ onSetupComplete }) {
  const [formData, setFormData] = useState({
    name: '',
    background: '',
    medicalHistory: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const patientData = storage.savePatient(formData)
      onSetupComplete(patientData)
    } catch (error) {
      console.error('Error creating patient:', error)
      alert('创建患者信息失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleQuickStart = (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      alert('请输入你的姓名')
      return
    }
    setLoading(true)
    try {
      const patientData = storage.savePatient({ name: formData.name, background: '', medicalHistory: '' })
      onSetupComplete(patientData)
    } catch (error) {
      console.error('Error creating patient:', error)
      alert('创建患者信息失败，请重试')
      setLoading(false)
    }
  }

  return (
    <div className="patient-setup">
      <div className="setup-card">
        <div className="setup-header">
          <span className="setup-emoji">🥑</span>
          <h2>欢迎使用 Avacado</h2>
          <p className="setup-description">
            我是你的健康聊天助手，可以帮助你记录每天的饮食、症状、运动、心情和睡眠情况。
            <br />
            <strong>只需填写姓名即可开始使用！</strong>
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="setup-form">
          <div className="form-group">
            <label htmlFor="name">
              姓名 <span className="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="请输入你的姓名"
              autoFocus
            />
          </div>

          <div className="form-group optional-section">
            <div className="optional-label">
              <label>其他信息（可选）</label>
              <span className="optional-hint">可以稍后补充</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="background">个人背景</label>
            <textarea
              id="background"
              name="background"
              value={formData.background}
              onChange={handleChange}
              placeholder="例如：30岁，软件工程师（可选）"
              rows="2"
            />
          </div>

          <div className="form-group">
            <label htmlFor="medicalHistory">病例信息</label>
            <textarea
              id="medicalHistory"
              name="medicalHistory"
              value={formData.medicalHistory}
              onChange={handleChange}
              placeholder="例如：有高血压病史（可选）"
              rows="2"
            />
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-btn primary" 
              disabled={loading || !formData.name.trim()}
            >
              {loading ? '提交中...' : '开始聊天 🥑'}
            </button>
            {formData.name.trim() && (
              <button 
                type="button" 
                className="submit-btn quick-start" 
                onClick={handleQuickStart}
                disabled={loading}
              >
                快速开始（仅姓名）
              </button>
            )}
          </div>
          
          <p className="setup-hint">
            💡 提示：只需填写姓名即可开始，其他信息可以稍后补充
          </p>
        </form>
      </div>
    </div>
  )
}

export default PatientSetup

