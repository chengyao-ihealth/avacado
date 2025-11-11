import React, { useState, useEffect } from 'react'
import ChatInterface from './components/ChatInterface'
import PatientSetup from './components/PatientSetup'
import Header from './components/Header'
import { storage } from './services/storage'
import './App.css'

function App() {
  const [patientId, setPatientId] = useState(null)
  const [patient, setPatient] = useState(null)
  const [isSetup, setIsSetup] = useState(false)

  useEffect(() => {
    // Check if patient ID exists in localStorage
    const savedPatientId = localStorage.getItem('avacado_patient_id')
    if (savedPatientId) {
      const patientData = storage.getPatient(savedPatientId)
      if (patientData) {
        setPatientId(savedPatientId)
        setPatient(patientData)
        setIsSetup(true)
      } else {
        // Patient not found, clear localStorage
        localStorage.removeItem('avacado_patient_id')
      }
    }
  }, [])

  const handleSetupComplete = (patientData) => {
    const savedPatient = storage.savePatient(patientData)
    setPatient(savedPatient)
    setPatientId(savedPatient.id)
    localStorage.setItem('avacado_patient_id', savedPatient.id)
    setIsSetup(true)
  }

  const handleReset = () => {
    localStorage.removeItem('avacado_patient_id')
    setPatientId(null)
    setPatient(null)
    setIsSetup(false)
  }

  return (
    <div className="app">
      <Header patient={patient} onReset={handleReset} />
      <main className="main-content">
        {!isSetup ? (
          <PatientSetup onSetupComplete={handleSetupComplete} />
        ) : (
          <ChatInterface patientId={patientId} patient={patient} />
        )}
      </main>
    </div>
  )
}

export default App

