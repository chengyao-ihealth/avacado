// LocalStorage data storage service

const STORAGE_KEYS = {
  PATIENTS: 'avacado_patients',
  LOGS: 'avacado_logs',
  CONVERSATIONS: 'avacado_conversations'
};

// Helper functions
function getToday() {
  return new Date().toISOString().split('T')[0];
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Storage operations
export const storage = {
  // Patients
  getPatients() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PATIENTS);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error reading patients:', error);
      return {};
    }
  },

  savePatient(patient) {
    try {
      const patients = this.getPatients();
      if (!patient.id) {
        patient.id = generateId();
        patient.createdAt = new Date().toISOString();
      }
      patients[patient.id] = patient;
      localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
      return patient;
    } catch (error) {
      console.error('Error saving patient:', error);
      throw error;
    }
  },

  getPatient(patientId) {
    const patients = this.getPatients();
    return patients[patientId] || null;
  },

  // Logs
  getLogs() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LOGS);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error reading logs:', error);
      return {};
    }
  },

  saveLog(patientId, date, field, value) {
    try {
      const logs = this.getLogs();
      if (!logs[patientId]) {
        logs[patientId] = {};
      }
      if (!logs[patientId][date]) {
        logs[patientId][date] = {};
      }
      logs[patientId][date][field] = value;
      logs[patientId][date].updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
    } catch (error) {
      console.error('Error saving log:', error);
      throw error;
    }
  },

  getTodayLog(patientId) {
    const logs = this.getLogs();
    const today = getToday();
    return logs[patientId]?.[today] || {};
  },

  getPatientLogs(patientId) {
    const logs = this.getLogs();
    return logs[patientId] || {};
  },

  checkMissingData(patientId) {
    const today = getToday();
    const todayLog = this.getTodayLog(patientId);
    const requiredFields = ['food', 'symptom', 'exercise', 'mood', 'sleep'];
    const missing = [];

    for (const field of requiredFields) {
      if (!todayLog[field] || todayLog[field].trim() === '') {
        missing.push(field);
      }
    }

    return missing;
  },

  // Conversations
  getConversations(patientId) {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
      const conversations = data ? JSON.parse(data) : {};
      return conversations[patientId] || [];
    } catch (error) {
      console.error('Error reading conversations:', error);
      return [];
    }
  },

  saveConversation(patientId, conversation) {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
      const conversations = data ? JSON.parse(data) : {};
      if (!conversations[patientId]) {
        conversations[patientId] = [];
      }
      if (!conversation.id) {
        conversation.id = generateId();
      }
      conversation.timestamp = conversation.timestamp || new Date().toISOString();
      conversations[patientId].push(conversation);
      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
      return conversation;
    } catch (error) {
      console.error('Error saving conversation:', error);
      throw error;
    }
  },

  // Clear all data (for testing/reset)
  clearAll() {
    localStorage.removeItem(STORAGE_KEYS.PATIENTS);
    localStorage.removeItem(STORAGE_KEYS.LOGS);
    localStorage.removeItem(STORAGE_KEYS.CONVERSATIONS);
  }
};

// Export helper
export { getToday, generateId };

