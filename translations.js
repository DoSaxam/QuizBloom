// ===== NeonQuest Internationalization System =====

const translations = {
  hi: {
    // Navigation
    nav_home: 'होम',
    nav_profile: 'प्रोफ़ाइल',
    nav_leaderboard: 'लीडरबोर्ड',
    
    // Hero Section
    hero_title: 'चलो भविष्य के ट्रिविया में!',
    hero_subtitle: 'खेल • तेज़ • भविष्यवादी',
    feature_categories: '20+ श्रेणियां',
    feature_languages: 'हिंदी + English',
    feature_offline: 'ऑफ़लाइन मोड',
    
    // Buttons
    btn_start: 'क्विज़ शुरू करें',
    btn_setup: 'श्रेणी चुनें',
    btn_back: 'वापस',
    btn_next: 'अगला',
    btn_submit: 'सबमिट',
    btn_pause: 'रोकें',
    btn_quit: 'छोड़ें',
    btn_start_quiz: 'क्विज़ शुरू करें',
    btn_play_again: 'फिर से खेलें',
    btn_change_category: 'श्रेणी बदलें',
    btn_share: 'शेयर करें',
    
    // Setup Page
    setup_title: 'अपना क्विज़ सेटअप करें',
    setup_subtitle: 'अपनी पसंदीदा श्रेणी और कठिनाई चुनें',
    label_category: 'श्रेणी',
    label_difficulty: 'कठिनाई',
    label_amount: 'प्रश्नों की संख्या',
    select_category: 'श्रेणी चुनें...',
    hint_category: 'आपकी पसंदीदा विषय चुनें',
    
    // Difficulty Levels
    difficulty_easy: 'आसान',
    difficulty_medium: 'मध्यम',
    difficulty_hard: 'कठिन',
    difficulty_easy_desc: 'शुरुआती के लिए',
    difficulty_medium_desc: 'चुनौतीपूर्ण',
    difficulty_hard_desc: 'विशेषज्ञों के लिए',
    
    // Question Amounts
    questions_5: '5 प्रश्न (2-3 मिनट)',
    questions_10: '10 प्रश्न (5-7 मिनट)',
    questions_15: '15 प्रश्न (8-10 मिनट)',
    questions_20: '20 प्रश्न (12-15 मिनट)',
    
    // Quiz Interface
    quiz_progress: 'प्रगति',
    time_remaining: 'समय शेष',
    question_of: 'प्रश्न %current% / %total%',
    
    // Feedback
    correct: 'सही!',
    incorrect: 'गलत!',
    time_up: 'समय समाप्त!',
    well_done: 'बहुत बढ़िया!',
    try_again: 'कोशिश करते रहें!',
    perfect_score: 'बेहतरीन स्कोर!',
    good_job: 'अच्छा काम!',
    
    // Results Page
    results_title: 'आपका स्कोर',
    score: 'स्कोर',
    percentage: 'प्रतिशत',
    stat_correct: 'सही',
    stat_incorrect: 'गलत',
    stat_avg_time: 'औसत समय',
    stat_streak: 'स्ट्रीक बोनस',
    stat_questions: 'प्रश्न',
    stat_players: 'खिलाड़ी',
    stat_available: 'उपलब्ध',
    
    // Loading States
    loading_title: 'क्वांटम प्रश्न लोड हो रहे हैं...',
    loading_questions: 'प्रश्न लोड हो रहे हैं...',
    loading_categories: 'श्रेणियां लोड हो रही हैं...',
    loading_results: 'परिणाम तैयार हो रहे हैं...',
    please_wait: 'कृपया प्रतीक्षा करें...',
    
    // Categories (will be populated from API)
    category_general: 'सामान्य ज्ञान',
    category_science: 'विज्ञान और प्रकृति',
    category_sports: 'खेल',
    category_history: 'इतिहास',
    category_politics: 'राजनीति',
    category_art: 'कला',
    category_celebrities: 'सेलिब्रिटीज़',
    category_animals: 'जानवर',
    category_vehicles: 'वाहन',
    category_comics: 'कॉमिक्स',
    category_gadgets: 'गैजेट्स',
    category_anime: 'एनीमे',
    category_cartoons: 'कार्टून',
    
    // Toast Messages
    toast_question_loaded: 'प्रश्न लोड हो गए!',
    toast_answer_selected: 'उत्तर चुना गया',
    toast_quiz_paused: 'क्विज़ रोक दिया गया',
    toast_quiz_resumed: 'क्विज़ फिर से शुरू',
    toast_network_error: 'नेटवर्क त्रुटि - कृपया पुनः प्रयास करें',
    toast_quiz_saved: 'प्रगति सेव हो गई',
    toast_score_shared: 'स्कोर शेयर किया गया!',
    
    // Error Messages
    error_network: 'नेटवर्क कनेक्शन में समस्या',
    error_questions_failed: 'प्रश्न लोड नहीं हो सके',
    error_categories_failed: 'श्रेणियां लोड नहीं हो सकीं',
    error_timeout: 'समय समाप्त - कृपया पुनः प्रयास करें',
    error_unknown: 'कोई त्रुटि हुई है',
    error_offline: 'आप ऑफ़लाइन हैं',
    
    // Achievements
    achievement_perfect: 'परफेक्ट स्कोर!',
    achievement_speedster: 'स्पीडस्टर',
    achievement_marathoner: 'मैराथन रनर',
    achievement_first_quiz: 'पहला क्विज़!',
    achievement_streak_5: '5 सही उत्तर!',
    achievement_streak_10: '10 सही उत्तर!',
    
    // Timer States
    timer_warning: 'जल्दी करें!',
    timer_critical: 'समय समाप्त हो रहा है!',
    
    // Offline Mode
    offline_title: 'ऑफ़लाइन मोड',
    offline_message: 'आप ऑफ़लाइन हैं। एक मिनी लोकल क्विज़ खेलें!',
    offline_questions_available: 'ऑफ़लाइन प्रश्न उपलब्ध',
    
    // Footer
    footer_privacy: 'गोपनीयता',
    footer_terms: 'नियम',
    footer_help: 'सहायता',
    footer_made: 'Made with ⚡ by NeonQuest',
    
    // Accessibility
    aria_timer: 'समय: %time% सेकंड शेष',
    aria_progress: 'प्रगति: %current% में से %total% प्रश्न पूरे',
    aria_score: 'आपका स्कोर: %score% अंक',
    aria_loading: 'लोड हो रहा है',
    aria_question_number: 'प्रश्न संख्या %number%',
    
    // Time Formats
    seconds: 'सेकंड',
    minutes: 'मिनट',
    time_format: '%minutes%:%seconds%',
    
    // Share Text
    share_text: 'मैंने NeonQuest Quiz में %score% स्कोर किया! आप भी खेलें: %url%',
    share_perfect: 'मैंने NeonQuest Quiz में पूरे अंक प्राप्त किए! 🎉 %url%',
    
    // Confirmation Messages
    confirm_quit: 'क्या आप वाकई क्विज़ छोड़ना चाहते हैं?',
    confirm_restart: 'क्या आप नया क्विज़ शुरू करना चाहते हैं?',
    
    // Time Bonus Messages
    time_bonus_excellent: 'बेहतरीन गति! +50 बोनस',
    time_bonus_good: 'अच्छी गति! +25 बोनस',
    time_bonus_normal: 'सामान्य गति',
  },
  
  en: {
    // Navigation
    nav_home: 'Home',
    nav_profile: 'Profile',
    nav_leaderboard: 'Leaderboard',
    
    // Hero Section
    hero_title: 'Welcome to Future Trivia!',
    hero_subtitle: 'Playful • Fast • Futuristic',
    feature_categories: '20+ Categories',
    feature_languages: 'Hindi + English',
    feature_offline: 'Offline Mode',
    
    // Buttons
    btn_start: 'Start Quiz',
    btn_setup: 'Choose Category',
    btn_back: 'Back',
    btn_next: 'Next',
    btn_submit: 'Submit',
    btn_pause: 'Pause',
    btn_quit: 'Quit',
    btn_start_quiz: 'Start Quiz',
    btn_play_again: 'Play Again',
    btn_change_category: 'Change Category',
    btn_share: 'Share',
    
    // Setup Page
    setup_title: 'Setup Your Quiz',
    setup_subtitle: 'Choose your favorite category and difficulty',
    label_category: 'Category',
    label_difficulty: 'Difficulty',
    label_amount: 'Number of Questions',
    select_category: 'Select Category...',
    hint_category: 'Choose your favorite topic',
    
    // Difficulty Levels
    difficulty_easy: 'Easy',
    difficulty_medium: 'Medium',
    difficulty_hard: 'Hard',
    difficulty_easy_desc: 'For beginners',
    difficulty_medium_desc: 'Challenging',
    difficulty_hard_desc: 'For experts',
    
    // Question Amounts
    questions_5: '5 Questions (2-3 min)',
    questions_10: '10 Questions (5-7 min)',
    questions_15: '15 Questions (8-10 min)',
    questions_20: '20 Questions (12-15 min)',
    
    // Quiz Interface
    quiz_progress: 'Progress',
    time_remaining: 'Time Remaining',
    question_of: 'Question %current% of %total%',
    
    // Feedback
    correct: 'Correct!',
    incorrect: 'Incorrect!',
    time_up: "Time's up!",
    well_done: 'Well done!',
    try_again: 'Keep trying!',
    perfect_score: 'Perfect score!',
    good_job: 'Good job!',
    
    // Results Page
    results_title: 'Your Score',
    score: 'Score',
    percentage: 'Percentage',
    stat_correct: 'Correct',
    stat_incorrect: 'Incorrect',
    stat_avg_time: 'Avg Time',
    stat_streak: 'Streak Bonus',
    stat_questions: 'Questions',
    stat_players: 'Players',
    stat_available: 'Available',
    
    // Loading States
    loading_title: 'Loading quantum questions...',
    loading_questions: 'Loading questions...',
    loading_categories: 'Loading categories...',
    loading_results: 'Preparing results...',
    please_wait: 'Please wait...',
    
    // Categories (will be populated from API)
    category_general: 'General Knowledge',
    category_science: 'Science & Nature',
    category_sports: 'Sports',
    category_history: 'History',
    category_politics: 'Politics',
    category_art: 'Art',
    category_celebrities: 'Celebrities',
    category_animals: 'Animals',
    category_vehicles: 'Vehicles',
    category_comics: 'Comics',
    category_gadgets: 'Gadgets',
    category_anime: 'Anime',
    category_cartoons: 'Cartoons',
    
    // Toast Messages
    toast_question_loaded: 'Questions loaded!',
    toast_answer_selected: 'Answer selected',
    toast_quiz_paused: 'Quiz paused',
    toast_quiz_resumed: 'Quiz resumed',
    toast_network_error: 'Network error - Please try again',
    toast_quiz_saved: 'Progress saved',
    toast_score_shared: 'Score shared!',
    
    // Error Messages
    error_network: 'Network connection problem',
    error_questions_failed: 'Failed to load questions',
    error_categories_failed: 'Failed to load categories',
    error_timeout: 'Timeout - Please try again',
    error_unknown: 'An error occurred',
    error_offline: 'You are offline',
    
    // Achievements
    achievement_perfect: 'Perfect Score!',
    achievement_speedster: 'Speedster',
    achievement_marathoner: 'Marathoner',
    achievement_first_quiz: 'First Quiz!',
    achievement_streak_5: '5 Correct Answers!',
    achievement_streak_10: '10 Correct Answers!',
    
    // Timer States
    timer_warning: 'Hurry up!',
    timer_critical: 'Time running out!',
    
    // Offline Mode
    offline_title: 'Offline Mode',
    offline_message: 'You are offline. Play a mini local quiz!',
    offline_questions_available: 'Offline questions available',
    
    // Footer
    footer_privacy: 'Privacy',
    footer_terms: 'Terms',
    footer_help: 'Help',
    footer_made: 'Made with ⚡ by NeonQuest',
    
    // Accessibility
    aria_timer: 'Time: %time% seconds remaining',
    aria_progress: 'Progress: %current% of %total% questions completed',
    aria_score: 'Your score: %score% points',
    aria_loading: 'Loading',
    aria_question_number: 'Question number %number%',
    
    // Time Formats
    seconds: 'seconds',
    minutes: 'minutes',
    time_format: '%minutes%:%seconds%',
    
    // Share Text
    share_text: 'I scored %score% on NeonQuest Quiz! Try it yourself: %url%',
    share_perfect: 'I got a perfect score on NeonQuest Quiz! 🎉 %url%',
    
    // Confirmation Messages
    confirm_quit: 'Are you sure you want to quit the quiz?',
    confirm_restart: 'Do you want to start a new quiz?',
    
    // Time Bonus Messages
    time_bonus_excellent: 'Excellent speed! +50 bonus',
    time_bonus_good: 'Good speed! +25 bonus',
    time_bonus_normal: 'Normal speed',
  }
};

// ===== Internationalization Class =====
class I18n {
  constructor() {
    this.currentLang = this.detectLanguage();
    this.translations = translations;
    this.fallbackLang = 'en';
    
    // Initialize language
    this.init();
  }
  
  detectLanguage() {
    // Check localStorage first
    const saved = localStorage.getItem('neonquest-lang');
    if (saved && this.translations[saved]) {
      return saved;
    }
    
    // Check browser language
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang.startsWith('hi')) {
      return 'hi';
    }
    
    // Default to Hindi as specified in requirements
    return 'hi';
  }
  
  init() {
    this.updateHTMLLang();
    this.updateAllText();
    this.updateLanguageToggle();
  }
  
  setLanguage(lang) {
    if (!this.translations[lang]) {
      console.warn(`Language ${lang} not available`);
      return false;
    }
    
    this.currentLang = lang;
    localStorage.setItem('neonquest-lang', lang);
    this.updateHTMLLang();
    this.updateAllText();
    this.updateLanguageToggle();
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('languageChanged', {
      detail: { language: lang }
    }));
    
    return true;
  }
  
  updateHTMLLang() {
    document.documentElement.lang = this.currentLang;
    document.documentElement.dir = this.currentLang === 'hi' ? 'ltr' : 'ltr'; // Both are LTR
  }
  
  get(key, replacements = {}) {
    const keys = key.split('.');
    let value = this.translations[this.currentLang];
    
    // Navigate through nested keys
    for (const k of keys) {
      value = value?.[k];
    }
    
    // Fallback to English if not found
    if (value === undefined) {
      value = this.translations[this.fallbackLang];
      for (const k of keys) {
        value = value?.[k];
      }
    }
    
    // Final fallback to key itself
    if (value === undefined) {
      console.warn(`Translation key "${key}" not found`);
      return key;
    }
    
    // Replace placeholders
    if (typeof value === 'string' && Object.keys(replacements).length > 0) {
      Object.entries(replacements).forEach(([placeholder, replacement]) => {
        value = value.replace(new RegExp(`%${placeholder}%`, 'g'), replacement);
      });
    }
    
    return value;
  }
  
  updateAllText() {
    // Update all elements with data-key attribute
    document.querySelectorAll('[data-key]').forEach(element => {
      const key = element.dataset.key;
      const translation = this.get(key);
      
      if (element.tagName === 'INPUT' && element.type === 'button') {
        element.value = translation;
      } else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        element.placeholder = translation;
      } else {
        element.textContent = translation;
      }
    });
    
    // Update title
    document.title = this.get('hero_title') + ' - NeonQuest Quiz';
  }
  
  updateLanguageToggle() {
    const langToggle = document.getElementById('current-lang');
    if (langToggle) {
      langToggle.textContent = this.currentLang === 'hi' ? 'हिं' : 'EN';
    }
  }
  
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return this.get('time_format', {
      minutes: mins.toString().padStart(2, '0'),
      seconds: secs.toString().padStart(2, '0')
    });
  }
  
  formatNumber(num) {
    // Format numbers according to locale
    if (this.currentLang === 'hi') {
      // Indian number formatting (लाख, करोड़)
      return new Intl.NumberFormat('hi-IN').format(num);
    } else {
      return new Intl.NumberFormat('en-US').format(num);
    }
  }
  
  // Plural forms support
  plural(key, count, replacements = {}) {
    let pluralKey = key;
    
    if (this.currentLang === 'hi') {
      // Hindi plural rules: 1 is singular, everything else is plural
      if (count !== 1) {
        pluralKey = `${key}_plural`;
      }
    } else {
      // English plural rules
      if (count !== 1) {
        pluralKey = `${key}_plural`;
      }
    }
    
    const translation = this.get(pluralKey) || this.get(key);
    return this.get(key, { ...replacements, count });
  }
  
  // Date formatting
  formatDate(date) {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    
    if (this.currentLang === 'hi') {
      return new Intl.DateTimeFormat('hi-IN', options).format(date);
    } else {
      return new Intl.DateTimeFormat('en-US', options).format(date);
    }
  }
  
  // Currency formatting (if needed for premium features)
  formatCurrency(amount, currency = 'INR') {
    if (this.currentLang === 'hi') {
      return new Intl.NumberFormat('hi-IN', {
        style: 'currency',
        currency: currency
      }).format(amount);
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
      }).format(amount);
    }
  }
}

// ===== Global I18n Instance =====
window.i18n = new I18n();

// ===== Helper Functions =====

// Quick translation function
window.t = (key, replacements) => window.i18n.get(key, replacements);

// Language toggle functionality
function toggleLanguage() {
  const currentLang = window.i18n.currentLang;
  const newLang = currentLang === 'hi' ? 'en' : 'hi';
  window.i18n.setLanguage(newLang);
}

// Initialize language toggle button
document.addEventListener('DOMContentLoaded', () => {
  const langToggle = document.getElementById('lang-toggle');
  if (langToggle) {
    langToggle.addEventListener('click', toggleLanguage);
  }
  
  // Update text when DOM is ready
  window.i18n.updateAllText();
});

// Listen for language changes to update dynamic content
window.addEventListener('languageChanged', (event) => {
  // Update any dynamic content that wasn't caught by data-key
  console.log('Language changed to:', event.detail.language);
  
  // Trigger custom event for components that need to update
  window.dispatchEvent(new CustomEvent('i18nUpdate'));
});

// Export for modules (if using ES6 modules later)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { I18n, translations };
}