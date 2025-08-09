// ===== NeonQuest State Management =====

class QuizState {
  constructor() {
    this.currentPage = 'splash';
    this.quiz = null;
    this.currentQuestionIndex = 0;
    this.answers = [];
    this.startTime = null;
    this.questionStartTime = null;
    this.timer = null;
    this.isPaused = false;
    this.score = 0;
    this.streak = 0;
    this.bestStreak = 0;
    this.timeBonus = 0;
    
    // Quiz configuration
    this.config = {
      category: null,
      difficulty: 'easy',
      amount: 10,
      timeLimit: 20 // seconds per question
    };
    
    // Initialize state
    this.init();
  }

  init() {
    // Load saved progress if exists
    this.loadSavedProgress();
    
    // Set up event listeners
    this.setupEventListeners();
  }

  // ===== Page Navigation =====
  navigateToPage(pageId) {
    // Hide current page
    const currentPageEl = document.querySelector('.page.active');
    if (currentPageEl) {
      currentPageEl.classList.remove('active');
      currentPageEl.classList.add('page-exit');
    }

    // Show new page
    const newPageEl = document.getElementById(`page-${pageId}`);
    if (newPageEl) {
      setTimeout(() => {
        if (currentPageEl) {
          currentPageEl.classList.remove('page-exit');
        }
        newPageEl.classList.add('active', 'page-enter');
        
        setTimeout(() => {
          newPageEl.classList.remove('page-enter');
        }, 300);
      }, 100);
    }

    this.currentPage = pageId;
    
    // Update navigation state
    this.updateNavigation();
    
    // Page-specific initialization
    this.initializePage(pageId);
  }

  updateNavigation() {
    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.removeAttribute('aria-current');
      if (link.dataset.page === this.currentPage) {
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  initializePage(pageId) {
    switch (pageId) {
      case 'setup':
        this.initializeSetupPage();
        break;
      case 'quiz':
        this.initializeQuizPage();
        break;
      case 'results':
        this.initializeResultsPage();
        break;
    }
  }

  // ===== Quiz Configuration =====
  setQuizConfig(config) {
    this.config = { ...this.config, ...config };
  }

  getQuizConfig() {
    return { ...this.config };
  }

  // ===== Quiz Flow =====
  async startQuiz(config = {}) {
    try {
      // Update configuration
      this.setQuizConfig(config);
      
      // Show loading
      this.showLoading();
      
      // Fetch questions
      const questions = await window.quizAPI.getQuestions({
        amount: this.config.amount,
        category: this.config.category,
        difficulty: this.config.difficulty
      });
      
      // Initialize quiz state
      this.quiz = {
        questions,
        totalQuestions: questions.length,
        category: this.config.category,
        difficulty: this.config.difficulty
      };
      
      this.currentQuestionIndex = 0;
      this.answers = [];
      this.score = 0;
      this.streak = 0;
      this.timeBonus = 0;
      this.startTime = Date.now();
      
      // Hide loading and navigate to quiz
      this.hideLoading();
      this.navigateToPage('quiz');
      
      // Start first question
      this.showQuestion(0);
      
    } catch (error) {
      this.hideLoading();
      this.showToast(window.quizAPI.getErrorMessage(error), 'error');
      console.error('Failed to start quiz:', error);
    }
  }

  showQuestion(index) {
    if (!this.quiz || index >= this.quiz.questions.length) {
      this.endQuiz();
      return;
    }

    const question = this.quiz.questions[index];
    this.currentQuestionIndex = index;
    this.questionStartTime = Date.now();
    
    // Update UI
    this.updateQuestionUI(question);
    this.updateProgressUI();
    this.startQuestionTimer(question.timeLimit);
    
    // Save progress
    this.saveProgress();
  }

  updateQuestionUI(question) {
    // Update question text
    const questionTextEl = document.getElementById('question-text');
    if (questionTextEl) {
      questionTextEl.textContent = question.question;
    }

    // Update category
    const categoryEl = document.getElementById('question-category');
    if (categoryEl) {
      categoryEl.textContent = question.category;
    }

    // Update options
    const optionsGrid = document.getElementById('options-grid');
    if (optionsGrid) {
      optionsGrid.innerHTML = '';
      
      question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-button';
        button.textContent = option;
        button.dataset.index = index;
        
        button.addEventListener('click', () => this.selectAnswer(index, option));
        
        optionsGrid.appendChild(button);
      });
    }

    // Disable next button
    const nextBtn = document.getElementById('next-question');
    if (nextBtn) {
      nextBtn.disabled = true;
    }
  }

  updateProgressUI() {
    if (!this.quiz) return;

    // Update progress bar
    const progressBar = document.getElementById('quiz-progress');
    if (progressBar) {
      const percentage = ((this.currentQuestionIndex) / this.quiz.totalQuestions) * 100;
      progressBar.style.width = `${percentage}%`;
    }

    // Update progress text
    const currentQuestionEl = document.getElementById('current-question');
    const totalQuestionsEl = document.getElementById('total-questions');
    
    if (currentQuestionEl) {
      currentQuestionEl.textContent = this.currentQuestionIndex + 1;
    }
    
    if (totalQuestionsEl) {
      totalQuestionsEl.textContent = this.quiz.totalQuestions;
    }
  }

  startQuestionTimer(duration) {
    this.stopQuestionTimer();
    
    let timeLeft = duration;
    const timerText = document.getElementById('timer-text');
    const timerProgress = document.getElementById('timer-progress');
    
    // Calculate circle circumference for progress
    const radius = 25;
    const circumference = 2 * Math.PI * radius;
    
    const updateTimer = () => {
      if (timerText) {
        timerText.textContent = timeLeft;
      }
      
      if (timerProgress) {
        const progress = timeLeft / duration;
        const offset = circumference - (progress * circumference);
        timerProgress.style.strokeDashoffset = offset;
        
        // Add warning states
        const timerContainer = document.getElementById('timer');
        if (timerContainer) {
          timerContainer.classList.remove('timer-warning', 'timer-critical');
          
          if (timeLeft <= 5 && timeLeft > 3) {
            timerContainer.classList.add('timer-warning');
          } else if (timeLeft <= 3) {
            timerContainer.classList.add('timer-critical');
          }
        }
      }
    };
    
    updateTimer();
    
    this.timer = setInterval(() => {
      timeLeft--;
      updateTimer();
      
      if (timeLeft <= 0) {
        this.stopQuestionTimer();
        this.timeOut();
      }
    }, 1000);
  }

  stopQuestionTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  selectAnswer(index, answer) {
    if (!this.quiz || this.isPaused) return;

    const question = this.quiz.questions[this.currentQuestionIndex];
    const isCorrect = index === question.correctIndex;
    const timeSpent = Date.now() - this.questionStartTime;
    
    // Stop timer
    this.stopQuestionTimer();
    
    // Record answer
    const answerData = {
      questionIndex: this.currentQuestionIndex,
      selectedIndex: index,
      selectedAnswer: answer,
      correctIndex: question.correctIndex,
      correctAnswer: question.correctAnswer,
      isCorrect,
      timeSpent,
      timeBonus: this.calculateTimeBonus(timeSpent, question.timeLimit)
    };
    
    this.answers.push(answerData);
    
    // Update score and streak
    if (isCorrect) {
      this.score += 100 + answerData.timeBonus;
      this.streak++;
      this.bestStreak = Math.max(this.bestStreak, this.streak);
    } else {
      this.streak = 0;
    }
    
    // Update UI
    this.showAnswerFeedback(answerData);
    this.highlightOptions(question, index);
    
    // Enable next button
    const nextBtn = document.getElementById('next-question');
    if (nextBtn) {
      nextBtn.disabled = false;
    }
  }

  calculateTimeBonus(timeSpent, timeLimit) {
    const timeSpentSeconds = timeSpent / 1000;
    const percentage = timeSpentSeconds / timeLimit;
    
    if (percentage <= 0.25) { // Answered in first 25% of time
      return 50;
    } else if (percentage <= 0.5) { // Answered in first 50% of time
      return 25;
    } else {
      return 0;
    }
  }

  showAnswerFeedback(answerData) {
    const feedbackModal = document.getElementById('answer-feedback-modal');
    const feedbackContent = document.getElementById('feedback-content');
    
    if (!feedbackModal || !feedbackContent) return;

    // Create feedback content
    const isCorrect = answerData.isCorrect;
    const feedbackTitle = isCorrect ? window.t('correct') : window.t('incorrect');
    const feedbackClass = isCorrect ? 'feedback-correct' : 'feedback-incorrect';
    const emoji = isCorrect ? '🎉' : '😔';
    
    feedbackContent.innerHTML = `
      <div class="${feedbackClass}">
        <h3>${emoji} ${feedbackTitle}</h3>
        <p><strong>${window.t('correct')}:</strong> ${answerData.correctAnswer}</p>
        ${answerData.timeBonus > 0 ? `<p class="time-bonus">⚡ +${answerData.timeBonus} ${window.t('time_bonus_excellent')}</p>` : ''}
      </div>
    `;
    
    // Show modal
    feedbackModal.classList.add('active');
    
    // Auto-hide after 2 seconds
    setTimeout(() => {
      feedbackModal.classList.remove('active');
    }, 2000);
  }

  highlightOptions(question, selectedIndex) {
    const options = document.querySelectorAll('.option-button');
    
    options.forEach((option, index) => {
      option.disabled = true;
      option.classList.remove('selected', 'correct', 'incorrect');
      
      if (index === selectedIndex) {
        option.classList.add('selected');
        if (index === question.correctIndex) {
          option.classList.add('correct', 'confetti-burst');
        } else {
          option.classList.add('incorrect', 'feedback-incorrect');
        }
      } else if (index === question.correctIndex) {
        option.classList.add('correct');
      }
    });
  }

  nextQuestion() {
    const nextIndex = this.currentQuestionIndex + 1;
    
    if (nextIndex < this.quiz.questions.length) {
      this.showQuestion(nextIndex);
    } else {
      this.endQuiz();
    }
  }

  timeOut() {
    // Auto-select no answer (treat as incorrect)
    const answerData = {
      questionIndex: this.currentQuestionIndex,
      selectedIndex: -1,
      selectedAnswer: null,
      correctIndex: this.quiz.questions[this.currentQuestionIndex].correctIndex,
      correctAnswer: this.quiz.questions[this.currentQuestionIndex].correctAnswer,
      isCorrect: false,
      timeSpent: this.quiz.questions[this.currentQuestionIndex].timeLimit * 1000,
      timeBonus: 0
    };
    
    this.answers.push(answerData);
    this.streak = 0;
    
    // Show feedback
    this.showToast(window.t('time_up'), 'warning');
    this.highlightOptions(this.quiz.questions[this.currentQuestionIndex], -1);
    
    // Enable next button
    const nextBtn = document.getElementById('next-question');
    if (nextBtn) {
      nextBtn.disabled = false;
    }
  }

  pauseQuiz() {
    this.isPaused = true;
    this.stopQuestionTimer();
    this.showToast(window.t('toast_quiz_paused'), 'info');
  }

  resumeQuiz() {
    this.isPaused = false;
    
    if (this.quiz && this.currentQuestionIndex < this.quiz.questions.length) {
      const question = this.quiz.questions[this.currentQuestionIndex];
      const timeSpent = Date.now() - this.questionStartTime;
      const timeLeft = Math.max(0, question.timeLimit - Math.floor(timeSpent / 1000));
      
      this.startQuestionTimer(timeLeft);
    }
    
    this.showToast(window.t('toast_quiz_resumed'), 'info');
  }

  endQuiz() {
    this.stopQuestionTimer();
    
    // Calculate final scores
    const results = this.calculateResults();
    
    // Save to history
    window.quizStorage.saveQuizHistory(results);
    
    // Update user stats
    this.updateUserStats(results);
    
    // Clear current quiz progress
    window.quizStorage.clearQuizProgress();
    
    // Navigate to results
    this.navigateToPage('results');
    this.displayResults(results);
  }

  calculateResults() {
    const correctAnswers = this.answers.filter(a => a.isCorrect).length;
    const totalQuestions = this.answers.length;
    const totalTime = Date.now() - this.startTime;
    const averageTime = totalTime / totalQuestions;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    
    const timeBonus = this.answers.reduce((sum, a) => sum + a.timeBonus, 0);
    const streakBonus = this.bestStreak >= 5 ? this.bestStreak * 10 : 0;
    
    const finalScore = (correctAnswers * 100) + timeBonus + streakBonus;
    
    return {
      id: Date.now(),
      quiz: this.quiz,
      answers: this.answers,
      correctAnswers,
      incorrectAnswers: totalQuestions - correctAnswers,
      totalQuestions,
      percentage,
      finalScore,
      timeBonus,
      streakBonus,
      bestStreak: this.bestStreak,
      totalTime,
      averageTime,
      difficulty: this.config.difficulty,
      category: this.config.category
    };
  }

  displayResults(results) {
    // Update score display
    const scoreEl = document.getElementById('final-score');
    const totalPossibleEl = document.getElementById('total-possible');
    const percentageEl = document.getElementById('score-percentage');
    
    if (scoreEl) {
      this.animateCounter(scoreEl, 0, results.finalScore, 1000);
    }
    
    if (totalPossibleEl) {
      const maxPossible = (results.totalQuestions * 100) + results.timeBonus + results.streakBonus;
      totalPossibleEl.textContent = maxPossible;
    }
    
    if (percentageEl) {
      this.animateCounter(percentageEl, 0, results.percentage, 800, '%');
    }
    
    // Update breakdown
    const correctCountEl = document.getElementById('correct-count');
    const incorrectCountEl = document.getElementById('incorrect-count');
    const avgTimeEl = document.getElementById('avg-time');
    const streakBonusEl = document.getElementById('streak-bonus');
    
    if (correctCountEl) {
      this.animateCounter(correctCountEl, 0, results.correctAnswers, 600);
    }
    
    if (incorrectCountEl) {
      this.animateCounter(incorrectCountEl, 0, results.incorrectAnswers, 600);
    }
    
    if (avgTimeEl) {
      const avgSeconds = Math.round(results.averageTime / 1000);
      avgTimeEl.textContent = `${avgSeconds}s`;
    }
    
    if (streakBonusEl) {
      streakBonusEl.textContent = `+${results.streakBonus}`;
    }
    
    // Check for achievements
    this.checkAchievements(results);
  }

  animateCounter(element, start, end, duration, suffix = '') {
    const startTime = Date.now();
    const difference = end - start;
    
    const step = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.round(start + (difference * progress));
      
      element.textContent = current + suffix;
      
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    
    requestAnimationFrame(step);
  }

  updateUserStats(results) {
    const stats = window.quizStorage.getUserStats();
    
    const updatedStats = {
      ...stats,
      totalQuizzes: stats.totalQuizzes + 1,
      totalQuestions: stats.totalQuestions + results.totalQuestions,
      correctAnswers: stats.correctAnswers + results.correctAnswers,
      averageScore: Math.round(((stats.averageScore * stats.totalQuizzes) + results.percentage) / (stats.totalQuizzes + 1)),
      bestScore: Math.max(stats.bestScore, results.percentage),
      bestStreak: Math.max(stats.bestStreak, results.bestStreak)
    };
    
    window.quizStorage.saveUserStats(updatedStats);
  }

  checkAchievements(results) {
    const achievements = [];
    
    if (results.percentage === 100) {
      achievements.push('achievement_perfect');
    }
    
    if (results.bestStreak >= 5) {
      achievements.push('achievement_speedster');
    }
    
    if (results.totalQuestions >= 20) {
      achievements.push('achievement_marathoner');
    }
    
    // Show achievement notifications
    achievements.forEach((achievement, index) => {
      setTimeout(() => {
        this.showAchievement(achievement);
      }, index * 1000);
    });
  }

  showAchievement(achievementKey) {
    const achievementEl = document.createElement('div');
    achievementEl.className = 'achievement-popup';
    achievementEl.innerHTML = `
      <div class="achievement-content">
        <div class="achievement-icon">🏆</div>
        <div class="achievement-text">
          <h4>${window.t(achievementKey)}</h4>
          <p>Achievement unlocked!</p>
        </div>
      </div>
    `;
    
    document.body.appendChild(achievementEl);
    
    setTimeout(() => {
      document.body.removeChild(achievementEl);
    }, 3000);
  }

  // ===== Setup Page =====
  async initializeSetupPage() {
    try {
      const categories = await window.quizAPI.getCategories();
      this.populateCategories(categories);
    } catch (error) {
      console.error('Failed to load categories:', error);
      this.showToast(window.t('error_categories_failed'), 'error');
    }
  }

  populateCategories(categories) {
    const categorySelect = document.getElementById('category-select');
    if (!categorySelect) return;

    categorySelect.innerHTML = `<option value="">${window.t('select_category')}</option>`;
    
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.id;
      
      const currentLang = window.i18n.currentLang;
      option.textContent = category.translatedName[currentLang] || category.name;
      
      categorySelect.appendChild(option);
    });
  }

  // ===== Progress Management =====
  saveProgress() {
    if (!this.quiz) return;

    const progressData = {
      quiz: this.quiz,
      currentQuestionIndex: this.currentQuestionIndex,
      answers: this.answers,
      score: this.score,
      streak: this.streak,
      bestStreak: this.bestStreak,
      startTime: this.startTime,
      config: this.config
    };

    window.quizStorage.saveQuizProgress(progressData);
  }

  loadSavedProgress() {
    const saved = window.quizStorage.loadQuizProgress();
    if (!saved) return false;

    // Restore state
    this.quiz = saved.quiz;
    this.currentQuestionIndex = saved.currentQuestionIndex;
    this.answers = saved.answers || [];
    this.score = saved.score || 0;
    this.streak = saved.streak || 0;
    this.bestStreak = saved.bestStreak || 0;
    this.startTime = saved.startTime;
    this.config = saved.config;

    // Show resume option
    this.showResumeOption();
    
    return true;
  }

  showResumeOption() {
    const resumeBtn = document.createElement('button');
    resumeBtn.className = 'btn btn-secondary btn-lg';
    resumeBtn.innerHTML = `
      <span>Resume Quiz</span>
      <span class="btn-icon">▶️</span>
    `;
    
    resumeBtn.addEventListener('click', () => {
      this.navigateToPage('quiz');
      this.showQuestion(this.currentQuestionIndex);
      resumeBtn.remove();
    });
    
    const heroActions = document.querySelector('.hero-actions');
    if (heroActions) {
      heroActions.appendChild(resumeBtn);
    }
  }

  // ===== UI Utilities =====
  showLoading() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.classList.add('active');
    }
  }

  hideLoading() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.classList.remove('active');
    }
  }

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    const container = document.getElementById('toast-container');
    if (container) {
      container.appendChild(toast);
      
      // Trigger show animation
      requestAnimationFrame(() => {
        toast.classList.add('show');
      });
      
      // Auto-remove
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
          if (container.contains(toast)) {
            container.removeChild(toast);
          }
        }, 200);
      }, 3000);
    }
  }

  // ===== Event Listeners =====
  setupEventListeners() {
    // Navigation
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-page]')) {
        const page = e.target.dataset.page;
        this.navigateToPage(page);
      }
    });

    // Quiz start buttons
    document.getElementById('start-quiz')?.addEventListener('click', () => {
      this.startQuiz();
    });

    document.getElementById('setup-quiz')?.addEventListener('click', () => {
      this.navigateToPage('setup');
    });

    // Setup form
    document.getElementById('quiz-setup-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = new FormData(e.target);
      const config = {
        category: formData.get('category') || null,
        difficulty: formData.get('difficulty') || 'easy',
        amount: parseInt(formData.get('amount')) || 10
      };
      
      this.startQuiz(config);
    });

    // Quiz controls
    document.getElementById('next-question')?.addEventListener('click', () => {
      this.nextQuestion();
    });

    document.getElementById('pause-quiz')?.addEventListener('click', () => {
      if (this.isPaused) {
        this.resumeQuiz();
      } else {
        this.pauseQuiz();
      }
    });

    document.getElementById('quit-quiz')?.addEventListener('click', () => {
      if (confirm(window.t('confirm_quit'))) {
        this.navigateToPage('splash');
        window.quizStorage.clearQuizProgress();
      }
    });

    // Results actions
    document.getElementById('play-again')?.addEventListener('click', () => {
      this.startQuiz(this.config);
    });

    document.getElementById('change-category')?.addEventListener('click', () => {
      this.navigateToPage('setup');
    });

    document.getElementById('share-score')?.addEventListener('click', () => {
      this.shareScore();
    });

    // Back buttons
    document.getElementById('back-to-home')?.addEventListener('click', () => {
      this.navigateToPage('splash');
    });

    // Language change updates
    window.addEventListener('languageChanged', () => {
      if (this.currentPage === 'setup') {
        this.initializeSetupPage();
      }
    });
  }

  shareScore() {
    if (!this.quiz) return;

    const url = window.location.href;
    const results = this.calculateResults();
    const text = window.t('share_text', {
      score: results.finalScore,
      url: url
    });

    if (navigator.share) {
      navigator.share({
        title: 'NeonQuest Quiz',
        text: text,
        url: url
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(text).then(() => {
        this.showToast(window.t('toast_score_shared'), 'success');
      });
    }
  }
}

// ===== Initialize Global State =====
window.quizState = new QuizState();

// ===== Export for modules =====
if (typeof module !== 'undefined' && module.exports) {
  module.exports = QuizState;
}