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

  return (
    <div className="patient-setup">
      <div className="setup-card">
        <div className="setup-header">
          <span className="setup-emoji">🥑</span>
          <h2>欢迎使用 Avacado</h2>
          <p>请先填写你的基本信息，这样我可以更好地帮助你</p>
        </div>
        
        <form onSubmit={handleSubmit} className="setup-form">
          <div className="form-group">
            <label htmlFor="name">姓名 *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="请输入你的姓名"
            />
          </div>

          <div className="form-group">
            <label htmlFor="background">个人背景</label>
            <textarea
              id="background"
              name="background"
              value={formData.background}
              onChange={handleChange}
              placeholder="可以介绍一下你的基本情况，比如年龄、职业等（可选）"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="medicalHistory">病例信息</label>
            <textarea
              id="medicalHistory"
              name="medicalHistory"
              value={formData.medicalHistory}
              onChange={handleChange}
              placeholder="可以分享一下你的健康状况或病史（可选）"
              rows="4"
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? '提交中...' : '开始使用 🥑'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default PatientSetup

