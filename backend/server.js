const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Data storage file
const DATA_DIR = path.join(__dirname, 'data');
const PATIENTS_FILE = path.join(DATA_DIR, 'patients.json');
const LOGS_FILE = path.join(DATA_DIR, 'logs.json');
const CONVERSATIONS_FILE = path.join(DATA_DIR, 'conversations.json');

// Initialize data files
async function initializeData() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    
    try {
      await fs.access(PATIENTS_FILE);
    } catch {
      await fs.writeFile(PATIENTS_FILE, JSON.stringify({}, null, 2));
    }
    
    try {
      await fs.access(LOGS_FILE);
    } catch {
      await fs.writeFile(LOGS_FILE, JSON.stringify({}, null, 2));
    }
    
    try {
      await fs.access(CONVERSATIONS_FILE);
    } catch {
      await fs.writeFile(CONVERSATIONS_FILE, JSON.stringify({}, null, 2));
    }
  } catch (error) {
    console.error('Error initializing data:', error);
  }
}

// Helper functions
async function readJSON(file) {
  try {
    const data = await fs.readFile(file, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}

async function writeJSON(file, data) {
  await fs.writeFile(file, JSON.stringify(data, null, 2));
}

// Get today's date string (YYYY-MM-DD)
function getToday() {
  return new Date().toISOString().split('T')[0];
}

// Check what data is missing for today
function checkMissingData(logs, patientId) {
  const today = getToday();
  const todayLog = logs[patientId]?.[today] || {};
  
  const requiredFields = ['food', 'symptom', 'exercise', 'mood', 'sleep'];
  const missing = [];
  
  for (const field of requiredFields) {
    if (!todayLog[field] || todayLog[field].trim() === '') {
      missing.push(field);
    }
  }
  
  return missing;
}

// Chatbot response logic
function generateChatbotResponse(message, patientData, logs, missingData) {
  const lowerMessage = message.toLowerCase();
  const originalMessage = message;
  
  // Greeting responses
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey') || 
      lowerMessage.includes('你好') || lowerMessage.includes('早上好') || lowerMessage.includes('晚上好')) {
    if (missingData.length > 0) {
      const fieldNames = {
        food: '饮食',
        symptom: '症状',
        exercise: '运动',
        mood: '心情',
        sleep: '睡眠'
      };
      const missingText = missingData.map(f => fieldNames[f] || f).join('、');
      return {
        message: `你好！我注意到你今天还没有记录${missingText}的情况。我们可以聊聊这些吗？`,
        type: 'greeting',
        suggestedFields: missingData
      };
    }
    return {
      message: '你好！我是你的健康助手 Avacado 🥑。今天感觉怎么样？',
      type: 'greeting'
    };
  }
  
  // Enhanced field detection with more keywords and patterns
  const fieldKeywords = {
    food: ['吃', '食物', '早餐', '午餐', '晚餐', '早饭', '午饭', '晚饭', 'meal', 'food', 'eat', 'ate', 'eating', 
           '米饭', '面条', '菜', '水果', '蔬菜', '肉', '鱼', '鸡蛋', '牛奶', '咖啡', '茶', '水'],
    symptom: ['症状', '不舒服', '疼痛', '痛', '难受', '疼', 'symptom', 'pain', 'ache', 'hurt', '不舒服', 
              '头疼', '肚子疼', '咳嗽', '发烧', '感冒', '累', '疲劳', '乏力'],
    exercise: ['运动', '锻炼', '跑步', '走路', '散步', 'exercise', 'workout', 'run', 'walk', 'jog', 'gym',
               '瑜伽', '游泳', '骑车', '骑车', '健身', '活动'],
    mood: ['心情', '感觉', '情绪', '开心', '难过', '高兴', '快乐', 'sad', 'happy', 'mood', 'feel', 'feeling',
           '焦虑', '紧张', '放松', '平静', '兴奋', '沮丧', '生气', '愤怒'],
    sleep: ['睡眠', '睡觉', '睡了', 'sleep', 'slept', 'rest', 'nap', '午睡', '晚上', '小时', '小时睡眠',
            '入睡', '醒来', '失眠', '困', '累']
  };
  
  // Try to detect which field the message relates to
  let detectedField = null;
  let maxMatches = 0;
  
  // Check all fields, not just missing ones (to update existing data)
  const allFields = ['food', 'symptom', 'exercise', 'mood', 'sleep'];
  for (const field of allFields) {
    const keywords = fieldKeywords[field] || [];
    const matches = keywords.filter(keyword => lowerMessage.includes(keyword)).length;
    if (matches > maxMatches && matches > 0) {
      maxMatches = matches;
      detectedField = field;
    }
  }
  
  // If we detected a field and it's missing, extract the data
  if (detectedField && missingData.includes(detectedField)) {
    const fieldNames = {
      food: '饮食',
      symptom: '症状',
      exercise: '运动',
      mood: '心情',
      sleep: '睡眠'
    };
    const remainingMissing = missingData.filter(f => f !== detectedField);
    let responseMessage = `好的，我记住了你关于${fieldNames[detectedField]}的情况。`;
    if (remainingMissing.length > 0) {
      const remainingText = remainingMissing.map(f => fieldNames[f] || f).join('、');
      responseMessage += `今天还需要记录${remainingText}的情况，想聊聊吗？`;
    } else {
      responseMessage += '你今天已经完成了所有记录，很棒！🥑';
    }
    return {
      message: responseMessage,
      type: 'data_collection',
      field: detectedField,
      extractData: true
    };
  }
  
  // If field is detected but already recorded, acknowledge it
  if (detectedField && !missingData.includes(detectedField)) {
    const fieldNames = {
      food: '饮食',
      symptom: '症状',
      exercise: '运动',
      mood: '心情',
      sleep: '睡眠'
    };
    return {
      message: `我了解到你更新了${fieldNames[detectedField]}的信息。还有什么想分享的吗？`,
      type: 'data_collection',
      field: detectedField,
      extractData: true
    };
  }
  
  // Proactive questions for missing data
  if (missingData.length > 0 && !detectedField) {
    const fieldNames = {
      food: '饮食',
      symptom: '症状',
      exercise: '运动',
      mood: '心情',
      sleep: '睡眠'
    };
    const nextField = missingData[0];
    const questions = {
      food: '今天吃了什么？可以分享一下你的饮食情况吗？',
      symptom: '今天身体感觉怎么样？有没有什么不舒服的地方？',
      exercise: '今天有没有运动？做了哪些活动呢？',
      mood: '今天心情怎么样？感觉如何？',
      sleep: '昨晚睡得怎么样？睡了几个小时？'
    };
    return {
      message: questions[nextField] || `可以聊聊你今天的${fieldNames[nextField]}情况吗？`,
      type: 'proactive_question',
      suggestedField: nextField
    };
  }
  
  // General responses
  if (lowerMessage.includes('谢谢') || lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
    return {
      message: '不客气！随时可以找我聊天。记得每天记录你的健康状况哦！🥑',
      type: 'acknowledgment'
    };
  }
  
  if (lowerMessage.includes('帮助') || lowerMessage.includes('help') || lowerMessage.includes('怎么用')) {
    return {
      message: '我可以帮你记录每天的饮食、症状、运动、心情和睡眠情况。你可以直接告诉我，或者我会主动询问你。有什么想聊的吗？',
      type: 'help'
    };
  }
  
  if (lowerMessage.includes('再见') || lowerMessage.includes('bye') || lowerMessage.includes('拜拜')) {
    return {
      message: '再见！记得每天记录你的健康状况，我会一直在这里等你。🥑',
      type: 'goodbye'
    };
  }
  
  // Default response - be more conversational
  if (missingData.length > 0) {
    const fieldNames = {
      food: '饮食',
      symptom: '症状',
      exercise: '运动',
      mood: '心情',
      sleep: '睡眠'
    };
    const nextField = missingData[0];
    return {
      message: `我明白了。顺便问一下，今天${fieldNames[nextField]}的情况怎么样？`,
      type: 'general',
      suggestedField: nextField
    };
  }
  
  return {
    message: '我理解了。还有什么想分享的吗？如果有任何健康相关的问题，随时告诉我！🥑',
    type: 'general'
  };
}

// API Routes

// Get or create patient
app.post('/api/patient', async (req, res) => {
  try {
    const patients = await readJSON(PATIENTS_FILE);
    const { name, background, medicalHistory } = req.body;
    
    let patientId = req.body.patientId;
    if (!patientId || !patients[patientId]) {
      patientId = uuidv4();
      patients[patientId] = {
        id: patientId,
        name: name || '患者',
        background: background || '',
        medicalHistory: medicalHistory || '',
        createdAt: new Date().toISOString()
      };
      await writeJSON(PATIENTS_FILE, patients);
    } else {
      // Update existing patient
      if (name) patients[patientId].name = name;
      if (background) patients[patientId].background = background;
      if (medicalHistory) patients[patientId].medicalHistory = medicalHistory;
      await writeJSON(PATIENTS_FILE, patients);
    }
    
    res.json(patients[patientId]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get patient data
app.get('/api/patient/:id', async (req, res) => {
  try {
    const patients = await readJSON(PATIENTS_FILE);
    const patient = patients[req.params.id];
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save log data
app.post('/api/logs', async (req, res) => {
  try {
    const logs = await readJSON(LOGS_FILE);
    const { patientId, date, field, value } = req.body;
    
    if (!logs[patientId]) {
      logs[patientId] = {};
    }
    if (!logs[patientId][date]) {
      logs[patientId][date] = {};
    }
    
    logs[patientId][date][field] = value;
    logs[patientId][date].updatedAt = new Date().toISOString();
    
    await writeJSON(LOGS_FILE, logs);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get logs for a patient
app.get('/api/logs/:patientId', async (req, res) => {
  try {
    const logs = await readJSON(LOGS_FILE);
    const patientLogs = logs[req.params.patientId] || {};
    res.json(patientLogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get today's logs
app.get('/api/logs/:patientId/today', async (req, res) => {
  try {
    const logs = await readJSON(LOGS_FILE);
    const today = getToday();
    const todayLog = logs[req.params.patientId]?.[today] || {};
    const missing = checkMissingData(logs, req.params.patientId);
    res.json({ log: todayLog, missing });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { patientId, message } = req.body;
    
    if (!patientId || !message) {
      return res.status(400).json({ error: 'Patient ID and message are required' });
    }
    
    // Load patient data and logs
    const patients = await readJSON(PATIENTS_FILE);
    const logs = await readJSON(LOGS_FILE);
    const conversations = await readJSON(CONVERSATIONS_FILE);
    
    const patient = patients[patientId];
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    // Check for missing data
    const missing = checkMissingData(logs, patientId);
    
    // Check if the last bot message was asking about a specific field
    // This helps us understand context when user responds
    let contextField = null;
    if (conversations[patientId] && conversations[patientId].length > 0) {
      const lastConversation = conversations[patientId][conversations[patientId].length - 1];
      const lastBotMsg = lastConversation.botMessage || '';
      
      // Check which field the last bot message was asking about
      const fieldKeywords = {
        food: ['饮食', '吃', 'food', 'meal', '早餐', '午餐', '晚餐'],
        symptom: ['症状', '身体', '不舒服', 'symptom', '感觉怎么样', '有没有'],
        exercise: ['运动', 'exercise', '活动', '锻炼'],
        mood: ['心情', 'mood', '感觉如何', '情绪'],
        sleep: ['睡眠', '睡觉', 'sleep', '睡了', '小时']
      };
      
      for (const [field, keywords] of Object.entries(fieldKeywords)) {
        if (keywords.some(kw => lastBotMsg.includes(kw)) && missing.includes(field)) {
          contextField = field;
          break;
        }
      }
    }
    
    // Generate response
    const response = generateChatbotResponse(message, patient, logs, missing);
    
    // Determine which field to save data to
    let fieldToSave = null;
    const lowerMessage = message.toLowerCase();
    const isLikelyResponse = !lowerMessage.includes('hello') && 
                            !lowerMessage.includes('hi') && 
                            !lowerMessage.includes('help') && 
                            !lowerMessage.includes('帮助') &&
                            !lowerMessage.includes('谢谢') &&
                            !lowerMessage.includes('thank') &&
                            message.length > 2;
    
    if (response.extractData && response.field) {
      // Explicitly detected field from keywords
      fieldToSave = response.field;
    } else if (contextField && isLikelyResponse) {
      // User is responding to a question about a specific field
      fieldToSave = contextField;
    } else if (response.suggestedField && isLikelyResponse && missing.includes(response.suggestedField)) {
      // Response suggested a field and user's message looks like a response
      fieldToSave = response.suggestedField;
    }
    
    // Save conversation
    if (!conversations[patientId]) {
      conversations[patientId] = [];
    }
    conversations[patientId].push({
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      userMessage: message,
      botMessage: response.message,
      type: response.type
    });
    await writeJSON(CONVERSATIONS_FILE, conversations);
    
    // Save data if we determined a field
    if (fieldToSave) {
      const today = getToday();
      if (!logs[patientId]) {
        logs[patientId] = {};
      }
      if (!logs[patientId][today]) {
        logs[patientId][today] = {};
      }
      logs[patientId][today][fieldToSave] = message;
      logs[patientId][today].updatedAt = new Date().toISOString();
      await writeJSON(LOGS_FILE, logs);
      
      // Update response to indicate data was saved
      if (!response.extractData) {
        response.extractData = true;
        response.field = fieldToSave;
      }
    }
    
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get conversations
app.get('/api/conversations/:patientId', async (req, res) => {
  try {
    const conversations = await readJSON(CONVERSATIONS_FILE);
    const patientConversations = conversations[req.params.patientId] || [];
    res.json(patientConversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Proactive check - get greeting if data is missing
app.get('/api/greeting/:patientId', async (req, res) => {
  try {
    const logs = await readJSON(LOGS_FILE);
    const missing = checkMissingData(logs, req.params.patientId);
    
    if (missing.length > 0) {
      const fieldNames = {
        food: '饮食',
        symptom: '症状',
        exercise: '运动',
        mood: '心情',
        sleep: '睡眠'
      };
      const missingText = missing.map(f => fieldNames[f] || f).join('、');
      res.json({
        shouldGreet: true,
        message: `你好！我注意到你今天还没有记录${missingText}的情况。我们可以聊聊这些吗？`,
        missingFields: missing
      });
    } else {
      res.json({
        shouldGreet: false,
        message: '你今天已经完成了所有记录，很棒！🥑'
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Initialize and start server
initializeData().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Avacado server running on port ${PORT}`);
  });
});

