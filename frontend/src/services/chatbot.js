// Chatbot logic - moved from backend

// Get today's date string (YYYY-MM-DD)
function getToday() {
  return new Date().toISOString().split('T')[0];
}

// Chatbot response logic
export function generateChatbotResponse(message, patientData, logs, missingData) {
  const lowerMessage = message.toLowerCase();
  
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

// Check if greeting should be sent
export function checkProactiveGreeting(missingData) {
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
      shouldGreet: true,
      message: `你好！我注意到你今天还没有记录${missingText}的情况。我们可以聊聊这些吗？`,
      missingFields: missingData
    };
  } else {
    return {
      shouldGreet: false,
      message: '你今天已经完成了所有记录，很棒！🥑'
    };
  }
}

