// ===== NeonQuest API Integration =====

class QuizAPI {
  constructor() {
    this.baseUrl = 'https://opentdb.com/api.php';
    this.categoriesUrl = 'https://opentdb.com/api_category.php';
    this.tokenUrl = 'https://opentdb.com/api_token.php';
    this.sessionToken = null;
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    this.requestTimeout = 10000; // 10 seconds
    
    // Initialize session token
    this.initSessionToken();
  }

  // ===== Session Token Management =====
  async initSessionToken() {
    try {
      const stored = localStorage.getItem('opentdb-token');
      const tokenData = stored ? JSON.parse(stored) : null;
      
      // Check if token is still valid (24 hours)
      if (tokenData && Date.now() - tokenData.timestamp < 24 * 60 * 60 * 1000) {
        this.sessionToken = tokenData.token;
        return;
      }
      
      // Request new token
      const response = await this.fetchWithTimeout(`${this.tokenUrl}?command=request`);
      const data = await response.json();
      
      if (data.response_code === 0) {
        this.sessionToken = data.token;
        localStorage.setItem('opentdb-token', JSON.stringify({
          token: data.token,
          timestamp: Date.now()
        }));
      }
    } catch (error) {
      console.warn('Failed to initialize session token:', error);
      // Continue without token - will get duplicate questions but still functional
    }
  }

  // ===== Network Utilities =====
  async fetchWithTimeout(url, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.requestTimeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  // ===== Cache Management =====
  getCacheKey(params) {
    return JSON.stringify(params);
  }

  getFromCache(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  // ===== Categories API =====
  async getCategories() {
    const cacheKey = 'categories';
    const cached = this.getFromCache(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const response = await this.fetchWithTimeout(this.categoriesUrl);
      const data = await response.json();
      
      if (data.trivia_categories) {
        const categories = data.trivia_categories.map(cat => ({
          id: cat.id,
          name: cat.name,
          translatedName: this.translateCategoryName(cat.name)
        }));
        
        this.setCache(cacheKey, categories);
        return categories;
      }
      
      throw new Error('Invalid categories response');
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      
      // Return fallback categories
      return this.getFallbackCategories();
    }
  }

  translateCategoryName(name) {
    const categoryMap = {
      'General Knowledge': { hi: 'सामान्य ज्ञान', en: 'General Knowledge' },
      'Entertainment: Books': { hi: 'मनोरंजन: पुस्तकें', en: 'Books' },
      'Entertainment: Film': { hi: 'मनोरंजन: फिल्म', en: 'Movies' },
      'Entertainment: Music': { hi: 'मनोरंजन: संगीत', en: 'Music' },
      'Entertainment: Musicals & Theatres': { hi: 'मनोरंजन: नाटक', en: 'Theatre' },
      'Entertainment: Television': { hi: 'मनोरंजन: टेलीविजन', en: 'Television' },
      'Entertainment: Video Games': { hi: 'मनोरंजन: वीडियो गेम', en: 'Video Games' },
      'Entertainment: Board Games': { hi: 'मनोरंजन: बोर्ड गेम', en: 'Board Games' },
      'Science & Nature': { hi: 'विज्ञान और प्रकृति', en: 'Science & Nature' },
      'Science: Computers': { hi: 'विज्ञान: कंप्यूटर', en: 'Computers' },
      'Science: Mathematics': { hi: 'विज्ञान: गणित', en: 'Mathematics' },
      'Mythology': { hi: 'पुराण कथा', en: 'Mythology' },
      'Sports': { hi: 'खेल', en: 'Sports' },
      'Geography': { hi: 'भूगोल', en: 'Geography' },
      'History': { hi: 'इतिहास', en: 'History' },
      'Politics': { hi: 'राजनीति', en: 'Politics' },
      'Art': { hi: 'कला', en: 'Art' },
      'Celebrities': { hi: 'सेलिब्रिटीज़', en: 'Celebrities' },
      'Animals': { hi: 'जानवर', en: 'Animals' },
      'Vehicles': { hi: 'वाहन', en: 'Vehicles' },
      'Entertainment: Comics': { hi: 'मनोरंजन: कॉमिक्स', en: 'Comics' },
      'Science: Gadgets': { hi: 'विज्ञान: गैजेट्स', en: 'Gadgets' },
      'Entertainment: Japanese Anime & Manga': { hi: 'मनोरंजन: एनीमे', en: 'Anime & Manga' },
      'Entertainment: Cartoon & Animations': { hi: 'मनोरंजन: कार्टून', en: 'Cartoons' }
    };

    const mapped = categoryMap[name];
    if (mapped) {
      return mapped;
    }

    // Fallback: clean up the name
    const cleaned = name.replace('Entertainment: ', '').replace('Science: ', '');
    return { hi: cleaned, en: cleaned };
  }

  getFallbackCategories() {
    return [
      { id: 9, name: 'General Knowledge', translatedName: { hi: 'सामान्य ज्ञान', en: 'General Knowledge' } },
      { id: 17, name: 'Science & Nature', translatedName: { hi: 'विज्ञान और प्रकृति', en: 'Science & Nature' } },
      { id: 21, name: 'Sports', translatedName: { hi: 'खेल', en: 'Sports' } },
      { id: 23, name: 'History', translatedName: { hi: 'इतिहास', en: 'History' } },
      { id: 22, name: 'Geography', translatedName: { hi: 'भूगोल', en: 'Geography' } }
    ];
  }

  // ===== Questions API =====
  async getQuestions(params = {}) {
    const {
      amount = 10,
      category = null,
      difficulty = null,
      type = 'multiple'
    } = params;

    // Build cache key
    const cacheKey = this.getCacheKey({ amount, category, difficulty, type });
    const cached = this.getFromCache(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      // Build URL
      const url = new URL(this.baseUrl);
      url.searchParams.set('amount', amount.toString());
      url.searchParams.set('type', type);
      
      if (category) {
        url.searchParams.set('category', category.toString());
      }
      
      if (difficulty) {
        url.searchParams.set('difficulty', difficulty);
      }
      
      if (this.sessionToken) {
        url.searchParams.set('token', this.sessionToken);
      }

      const response = await this.fetchWithTimeout(url.toString());
      const data = await response.json();
      
      // Handle API response codes
      switch (data.response_code) {
        case 0: // Success
          const questions = this.processQuestions(data.results);
          this.setCache(cacheKey, questions);
          return questions;
          
        case 1: // No Results
          throw new Error('No questions available for the selected criteria');
          
        case 2: // Invalid Parameter
          throw new Error('Invalid parameters provided');
          
        case 3: // Token Not Found
          await this.resetSessionToken();
          return this.getQuestions(params); // Retry once
          
        case 4: // Token Empty
          await this.resetSessionToken();
          return this.getQuestions(params); // Retry once
          
        default:
          throw new Error('Unknown API error');
      }
    } catch (error) {
      console.error('Failed to fetch questions:', error);
      
      // Return fallback questions if online request fails
      return this.getFallbackQuestions(amount);
    }
  }

  async resetSessionToken() {
    localStorage.removeItem('opentdb-token');
    this.sessionToken = null;
    await this.initSessionToken();
  }

  processQuestions(rawQuestions) {
    return rawQuestions.map((q, index) => {
      // Decode HTML entities
      const question = this.decodeHTML(q.question);
      const correctAnswer = this.decodeHTML(q.correct_answer);
      const incorrectAnswers = q.incorrect_answers.map(ans => this.decodeHTML(ans));
      
      // Shuffle options
      const options = this.shuffleArray([correctAnswer, ...incorrectAnswers]);
      
      return {
        id: index + 1,
        category: q.category,
        difficulty: q.difficulty,
        type: q.type,
        question,
        options,
        correctAnswer,
        incorrectAnswers,
        correctIndex: options.indexOf(correctAnswer),
        timeLimit: 20 // 20 seconds per question
      };
    });
  }

  decodeHTML(text) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  }

  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // ===== Fallback Questions =====
  getFallbackQuestions(amount = 10) {
    const fallbackQuestions = [
      {
        id: 1,
        category: 'General Knowledge',
        difficulty: 'easy',
        type: 'multiple',
        question: 'What is the capital of India?',
        options: ['Mumbai', 'New Delhi', 'Kolkata', 'Chennai'],
        correctAnswer: 'New Delhi',
        correctIndex: 1,
        timeLimit: 20
      },
      {
        id: 2,
        category: 'Science & Nature',
        difficulty: 'easy',
        type: 'multiple',
        question: 'What gas do plants absorb from the atmosphere during photosynthesis?',
        options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Hydrogen'],
        correctAnswer: 'Carbon Dioxide',
        correctIndex: 1,
        timeLimit: 20
      },
      {
        id: 3,
        category: 'Geography',
        difficulty: 'medium',
        type: 'multiple',
        question: 'Which is the longest river in the world?',
        options: ['Amazon River', 'Nile River', 'Yangtze River', 'Mississippi River'],
        correctAnswer: 'Nile River',
        correctIndex: 1,
        timeLimit: 20
      },
      {
        id: 4,
        category: 'History',
        difficulty: 'medium',
        type: 'multiple',
        question: 'In which year did World War II end?',
        options: ['1944', '1945', '1946', '1947'],
        correctAnswer: '1945',
        correctIndex: 1,
        timeLimit: 20
      },
      {
        id: 5,
        category: 'Sports',
        difficulty: 'easy',
        type: 'multiple',
        question: 'How many players are on a football (soccer) team on the field at one time?',
        options: ['10', '11', '12', '9'],
        correctAnswer: '11',
        correctIndex: 1,
        timeLimit: 20
      }
    ];

    // Repeat questions if needed
    const questions = [];
    for (let i = 0; i < amount; i++) {
      const question = { ...fallbackQuestions[i % fallbackQuestions.length] };
      question.id = i + 1;
      questions.push(question);
    }

    return questions;
  }

  // ===== Network Status =====
  isOnline() {
    return navigator.onLine;
  }

  // ===== Error Handling =====
  getErrorMessage(error) {
    if (!this.isOnline()) {
      return window.t('error_offline');
    }
    
    if (error.message.includes('timeout')) {
      return window.t('error_timeout');
    }
    
    if (error.message.includes('Network')) {
      return window.t('error_network');
    }
    
    return window.t('error_unknown');
  }
}

// ===== Local Storage Manager =====
class QuizStorage {
  constructor() {
    this.storagePrefix = 'neonquest-';
  }

  saveQuizProgress(quizData) {
    try {
      localStorage.setItem(
        `${this.storagePrefix}current-quiz`,
        JSON.stringify({
          ...quizData,
          timestamp: Date.now()
        })
      );
      return true;
    } catch (error) {
      console.error('Failed to save quiz progress:', error);
      return false;
    }
  }

  loadQuizProgress() {
    try {
      const saved = localStorage.getItem(`${this.storagePrefix}current-quiz`);
      if (!saved) return null;

      const data = JSON.parse(saved);
      
      // Check if saved quiz is less than 24 hours old
      if (Date.now() - data.timestamp > 24 * 60 * 60 * 1000) {
        this.clearQuizProgress();
        return null;
      }

      return data;
    } catch (error) {
      console.error('Failed to load quiz progress:', error);
      return null;
    }
  }

  clearQuizProgress() {
    try {
      localStorage.removeItem(`${this.storagePrefix}current-quiz`);
      return true;
    } catch (error) {
      console.error('Failed to clear quiz progress:', error);
      return false;
    }
  }

  saveQuizHistory(quizResult) {
    try {
      const history = this.getQuizHistory();
      history.unshift({
        ...quizResult,
        timestamp: Date.now()
      });

      // Keep only last 50 quiz results
      const limitedHistory = history.slice(0, 50);

      localStorage.setItem(
        `${this.storagePrefix}quiz-history`,
        JSON.stringify(limitedHistory)
      );
      
      return true;
    } catch (error) {
      console.error('Failed to save quiz history:', error);
      return false;
    }
  }

  getQuizHistory() {
    try {
      const saved = localStorage.getItem(`${this.storagePrefix}quiz-history`);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to load quiz history:', error);
      return [];
    }
  }

  saveUserStats(stats) {
    try {
      localStorage.setItem(
        `${this.storagePrefix}user-stats`,
        JSON.stringify({
          ...stats,
          lastUpdated: Date.now()
        })
      );
      return true;
    } catch (error) {
      console.error('Failed to save user stats:', error);
      return false;
    }
  }

  getUserStats() {
    try {
      const saved = localStorage.getItem(`${this.storagePrefix}user-stats`);
      if (!saved) {
        return {
          totalQuizzes: 0,
          totalQuestions: 0,
          correctAnswers: 0,
          averageScore: 0,
          bestScore: 0,
          currentStreak: 0,
          bestStreak: 0,
          achievements: []
        };
      }
      return JSON.parse(saved);
    } catch (error) {
      console.error('Failed to load user stats:', error);
      return {};
    }
  }
}

// ===== Initialize Global Instances =====
window.quizAPI = new QuizAPI();
window.quizStorage = new QuizStorage();

// ===== Network Status Monitoring =====
window.addEventListener('online', () => {
  window.dispatchEvent(new CustomEvent('networkStatusChanged', {
    detail: { online: true }
  }));
});

window.addEventListener('offline', () => {
  window.dispatchEvent(new CustomEvent('networkStatusChanged', {
    detail: { online: false }
  }));
});

// ===== Export for modules =====
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { QuizAPI, QuizStorage };
}