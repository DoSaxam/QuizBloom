# 🚀 NeonQuest Quiz - चलो भविष्य के ट्रिविया में!

A beautiful, playful, futuristic HTML/CSS/JS quiz app with blazing-fast performance, neon retro-futurism aesthetics, and rich micro-interactions.

![NeonQuest Quiz Preview](data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDgwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjMEEwRTFBIi8+Cjx0ZXh0IHg9IjQwMCIgeT0iMjAwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSI0OCIgZmlsbD0iIzAwRkZDQyIgdGV4dC1hbmNob3I9Im1pZGRsZSI+TmVvblF1ZXN0IFF1aXo8L3RleHQ+CjxyZWN0IHg9IjEwMCIgeT0iMjUwIiB3aWR0aD0iNjAwIiBoZWlnaHQ9IjgwIiByeD0iMjAiIGZpbGw9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wNikiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjE4KSIvPgo8L3N2Zz4K)

## ✨ Features

### 🎨 **Visual Excellence**
- **Neon Retro-Futurism**: Dark backgrounds with vibrant neon accents
- **Glassmorphism**: Semi-transparent surfaces with backdrop blur effects
- **Micro-Interactions**: Smooth animations and feedback for every action
- **Responsive Design**: Perfect on mobile, tablet, and desktop

### 🌐 **Multilingual Support**
- **Hindi + English**: Full bilingual interface
- **Dynamic Language Toggle**: Switch languages instantly
- **Localized Content**: Numbers, dates, and currencies formatted correctly

### 🚀 **Performance Optimized**
- **Core Web Vitals**: LCP ≤2.5s, CLS <0.1, INP <200ms
- **Service Worker**: Offline support with smart caching strategies
- **GPU Accelerated**: Hardware-accelerated animations
- **Lazy Loading**: Optimized resource loading

### ♿ **Accessibility First**
- **WCAG AA Compliant**: Full keyboard navigation and screen reader support
- **ARIA Labels**: Comprehensive accessibility markup
- **Reduced Motion**: Respects user preferences
- **Focus Management**: Proper focus trap and restoration

### 🎮 **Quiz Features**
- **20+ Categories**: From General Knowledge to Science & Nature
- **Multiple Difficulties**: Easy, Medium, and Hard levels
- **Timed Questions**: 20-second timer with visual indicators
- **Scoring System**: Points, time bonuses, and streak multipliers
- **Progress Saving**: Resume quizzes where you left off
- **Achievements**: Unlock badges for various accomplishments

### 📱 **Progressive Web App**
- **Installable**: Add to home screen on mobile and desktop
- **Offline Mode**: Play with cached questions when offline
- **Background Sync**: Sync data when connection is restored
- **Push Notifications**: Get notified about new quizzes

## 🛠️ **Technical Stack**

### **Frontend**
- **HTML5**: Semantic markup with proper structure
- **CSS3**: Custom properties, Grid, Flexbox, and modern features
- **Vanilla JavaScript**: ES6+ with modern APIs
- **Service Worker**: Background processing and caching

### **API Integration**
- **OpenTDB**: Open Trivia Database for questions
- **Session Tokens**: Prevent duplicate questions
- **Smart Caching**: 5-minute cache with background updates
- **Fallback Questions**: Offline quiz experience

### **Performance Features**
- **Critical CSS**: Inline critical styles
- **Font Optimization**: Variable fonts with font-display: swap
- **Image Optimization**: WebP/AVIF with fallbacks
- **Code Splitting**: Deferred non-critical JavaScript

## 🚀 **Quick Start**

### **Prerequisites**
- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+)
- Web server (for service worker functionality)

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/neonquest-quiz.git
   cd neonquest-quiz
   ```

2. **Serve the files**
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

### **Deployment**

The app is ready for deployment to any static hosting service:

- **Netlify**: Drag and drop the folder
- **Vercel**: Connect GitHub repository
- **GitHub Pages**: Enable in repository settings
- **Firebase Hosting**: `firebase deploy`

## 📁 **Project Structure**

```
neonquest-quiz/
├── index.html              # Main HTML file
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker
├── styles/
│   ├── theme.css           # Design system & variables
│   ├── components.css      # UI components
│   └── animations.css      # Micro-interactions & animations
├── scripts/
│   ├── translations.js     # i18n system
│   ├── api.js             # API integration & caching
│   ├── state.js           # Quiz state management
│   └── app.js             # Main application logic
└── README.md              # This file
```

## 🎨 **Design System**

### **Color Palette**
```css
--bg-base: #0A0E1A;           /* Deep space blue */
--accent-primary: #00FFCC;     /* Neon cyan */
--accent-secondary: #1E90FF;   /* Electric blue */
--accent-magenta: #FF007F;     /* Neon magenta */
--success: #22E39E;           /* Success green */
--warning: #FFCC00;           /* Warning yellow */
--error: #FF4D6D;             /* Error red */
```

### **Typography**
- **Primary**: Inter Variable (system fallback)
- **Display**: Orbitron (sci-fi headings)
- **Scale**: Responsive clamp() functions
- **Performance**: Variable fonts with font-display: swap

### **Spacing & Layout**
- **Container**: Max 1100px with responsive padding
- **Grid**: 12-column responsive system
- **Spacing**: 8px base unit with consistent scale
- **Breakpoints**: Mobile-first approach

## 🔧 **Configuration**

### **Quiz Settings**
```javascript
// Default configuration in state.js
config: {
  category: null,        // Any category
  difficulty: 'easy',    // easy | medium | hard
  amount: 10,           // 5-20 questions
  timeLimit: 20         // seconds per question
}
```

### **API Configuration**
```javascript
// API endpoints in api.js
baseUrl: 'https://opentdb.com/api.php'
categoriesUrl: 'https://opentdb.com/api_category.php'
tokenUrl: 'https://opentdb.com/api_token.php'
```

### **Performance Targets**
- **LCP**: ≤2.5 seconds
- **CLS**: <0.1
- **INP**: <200ms
- **Cache**: 5-minute API cache
- **Offline**: Full offline functionality

## 🌍 **Internationalization**

### **Supported Languages**
- **Hindi**: Primary language with Devanagari script
- **English**: Secondary language for broader accessibility

### **Adding New Languages**
1. Add translations to `translations.js`
2. Update language detection logic
3. Test RTL support if needed
4. Add locale-specific formatting

### **Usage**
```javascript
// Get translated text
window.t('btn_start');  // "क्विज़ शुरू करें" or "Start Quiz"

// With replacements
window.t('question_of', { current: 1, total: 10 });
```

## ♿ **Accessibility Features**

### **Keyboard Navigation**
- **Tab**: Navigate through interactive elements
- **Arrow Keys**: Navigate quiz options
- **Enter/Space**: Activate buttons and options
- **Escape**: Close modals and overlays

### **Screen Reader Support**
- **ARIA Labels**: Comprehensive labeling
- **Live Regions**: Dynamic content announcements
- **Semantic HTML**: Proper heading hierarchy
- **Skip Links**: Jump to main content

### **Visual Accessibility**
- **High Contrast**: WCAG AA compliant colors
- **Focus Indicators**: Visible focus states
- **Reduced Motion**: Respects user preferences
- **Font Scaling**: Supports browser zoom up to 200%

## 📊 **Performance Optimization**

### **Loading Strategy**
1. **Critical CSS**: Inlined in HTML head
2. **Font Preloading**: Variable fonts with fallbacks
3. **API Preloading**: Categories cached on app start
4. **Service Worker**: Aggressive caching for repeat visits

### **Runtime Optimization**
- **GPU Acceleration**: Transform/opacity animations only
- **RequestAnimationFrame**: Smooth 60fps animations
- **Debounced Events**: Optimized resize and scroll handlers
- **Lazy Loading**: Non-critical features loaded on demand

### **Caching Strategy**
- **App Shell**: Cache-first with versioning
- **API Data**: Network-first with 5-minute cache
- **Static Assets**: Stale-while-revalidate
- **Offline Support**: Fallback questions and full functionality

## 🔒 **Security & Privacy**

### **Data Handling**
- **Local Storage**: All data stored locally
- **No Tracking**: No analytics or user tracking
- **HTTPS Only**: Secure connections required
- **CSP**: Content Security Policy implemented

### **API Security**
- **Session Tokens**: Prevent question duplicates
- **Rate Limiting**: Respectful API usage
- **Error Handling**: Graceful fallbacks for failures
- **Input Sanitization**: HTML entity decoding

## 🧪 **Testing**

### **Browser Support**
- **Chrome**: 90+ ✅
- **Firefox**: 88+ ✅
- **Safari**: 14+ ✅
- **Edge**: 90+ ✅

### **Device Testing**
- **Mobile**: iOS Safari, Chrome Android
- **Tablet**: iPad, Android tablets
- **Desktop**: Windows, macOS, Linux
- **Screen Readers**: NVDA, JAWS, VoiceOver

### **Performance Testing**
- **Lighthouse**: 90+ scores across all metrics
- **WebPageTest**: Core Web Vitals validation
- **Network**: 3G, 4G, and offline testing

## 🚀 **Deployment Guide**

### **Static Hosting**
```bash
# Build optimized version
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=dist

# Deploy to Vercel
vercel --prod

# Deploy to GitHub Pages
git push origin main
```

### **Custom Domain**
1. Configure DNS records
2. Enable HTTPS
3. Update service worker scope
4. Test PWA installation

### **CDN Configuration**
```
Cache-Control: public, max-age=31536000  # Static assets
Cache-Control: public, max-age=3600      # HTML files
```

## 🤝 **Contributing**

### **Development Setup**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### **Code Style**
- **JavaScript**: ES6+ with clear comments
- **CSS**: BEM methodology with custom properties
- **HTML**: Semantic markup with accessibility
- **Commits**: Conventional commit format

### **Testing Checklist**
- [ ] Visual regression testing
- [ ] Accessibility audit
- [ ] Performance validation
- [ ] Cross-browser testing
- [ ] Mobile responsiveness

## 📝 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **OpenTDB**: Free trivia questions API
- **Inter Font**: Beautiful variable font family
- **Orbitron**: Futuristic display font
- **MDN**: Web development documentation
- **Can I Use**: Browser compatibility data

## 📞 **Support**

- **Issues**: [GitHub Issues](https://github.com/your-username/neonquest-quiz/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/neonquest-quiz/discussions)
- **Email**: support@neonquest.dev

---

<div align="center">
  <strong>Made with ⚡ and lots of ☕</strong><br>
  <em>Happy quizzing! 🎉</em>
</div>