import React from 'react'
import './DailyLogSummary.css'

const fieldLabels = {
  food: '饮食',
  symptom: '症状',
  exercise: '运动',
  mood: '心情',
  sleep: '睡眠'
}

const fieldIcons = {
  food: '🍽️',
  symptom: '🤒',
  exercise: '🏃',
  mood: '😊',
  sleep: '😴'
}

function DailyLogSummary({ todayLog, missingFields, onSaveLog }) {
  const allFields = ['food', 'symptom', 'exercise', 'mood', 'sleep']
  
  const getCompletionPercentage = () => {
    const completed = allFields.length - missingFields.length
    return Math.round((completed / allFields.length) * 100)
  }

  return (
    <div className="daily-log-summary">
      <div className="summary-header">
        <h3>今日记录</h3>
        <div className="completion-badge">
          {getCompletionPercentage()}% 完成
        </div>
      </div>
      
      <div className="log-fields">
        {allFields.map(field => {
          const isMissing = missingFields.includes(field)
          const value = todayLog[field] || ''
          
          return (
            <div 
              key={field} 
              className={`log-field ${isMissing ? 'missing' : 'completed'}`}
            >
              <div className="field-icon">{fieldIcons[field]}</div>
              <div className="field-content">
                <div className="field-label">{fieldLabels[field]}</div>
                {value ? (
                  <div className="field-value">{value}</div>
                ) : (
                  <div className="field-placeholder">尚未记录</div>
                )}
              </div>
              {isMissing && (
                <div className="missing-indicator">⚠️</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default DailyLogSummary

