# 🍽️ Boston Restaurant Business Planning App

A comprehensive business planning application specifically designed for restaurant entrepreneurs in Boston, featuring local market insights, equipment planning, financial projections, and regulatory guidance.

## 🚀 Live Demo

**Live app:** [restaurant-startup-app.web.app](https://restaurant-startup-app.web.app)

## ✨ Features

### 🤖 AI-Powered Assistance (NEW!)
- **Auto-Fill Forms**: AI intelligently completes business plan sections
- **Market Research**: Get AI-powered market data and insights for your location
- **Financial Advisor**: AI analyzes your projections and provides recommendations
- **Content Generation**: Generate professional business plan content
- **Question Answering**: Ask questions and get expert restaurant advice
- **See [AI_SETUP_GUIDE.md](AI_SETUP_GUIDE.md) for setup instructions**

### 🏗️ Business Planning
- **Idea Formation**: Structured approach to concept development
- **Market Analysis**: Boston-specific market data and neighborhood insights with AI research
- **Financial Planning**: Comprehensive cost projections and revenue modeling
- **Management Team**: Organizational structure and role planning

### 🍳 Equipment Planning
- **Kitchen Equipment**: Complete cooking, prep, and refrigeration equipment
- **Bar Equipment**: Beverage service, glassware, and bar tools
- **Front of House**: Tables, chairs, POS systems, and customer-facing equipment
- **Vendor Management**: Equipment sourcing and vendor relationships
- **Online Sources**: Direct links to equipment suppliers with pricing

### 📋 Opening Plan
- **Phase-based Roadmap**: 6-phase opening process
- **Task Management**: Detailed task lists with progress tracking
- **Boston-Specific Requirements**: Local permits, licenses, and regulations
- **Timeline Planning**: Estimated durations and dependencies

### 🔐 User Management
- **Multi-User Support**: Create and manage multiple business plans
- **Authentication**: Email/password and Google sign-in (required to use the app)
- **Data Persistence**: Cloud storage with offline support
- **Draft Management**: Save, compare, and manage multiple plan versions

## 🛠️ Technology Stack

- **Frontend**: React 18, JavaScript ES6+
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Backend**: Firebase (Authentication, Firestore, Hosting)
- **State Management**: React Context API
- **Build Tool**: Create React App

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Firebase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/chefmatt2024/restaurant-startup-app.git
   cd restaurant-startup-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Authentication (Email/Password and Google)
   - Enable Firestore Database
   - Copy your Firebase config to `.env.local`

4. **Configure environment variables**
   ```bash
   cp env.example .env.local
   ```
   Edit `.env.local` with your Firebase configuration:
   ```
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```

5. **Start development server**
   ```bash
   npm start
   ```

6. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Usage

### Getting Started
1. **Sign Up**: Create an account (required; email/password or Google sign-in)
2. **Create Draft**: Start a new business plan draft
3. **Fill Sections**: Complete each section of your business plan
4. **Track Progress**: Use the opening plan to track your progress
5. **Save & Share**: Save your work and share with team members

### Key Sections
- **Idea Formation**: Define your restaurant concept
- **Market Analysis**: Research Boston market and competition
- **Financial Planning**: Project costs and revenue
- **Equipment Planning**: Plan kitchen and bar equipment
- **Management Team**: Define roles and responsibilities
- **Opening Plan**: Step-by-step opening process

## 🔧 Firebase Setup

### Authentication
1. Go to Firebase Console → Authentication → Sign-in method
2. Enable **Email/Password** authentication
3. Enable **Google** authentication
4. Add `localhost` to authorized domains

### Firestore Database
1. Go to Firebase Console → Firestore Database
2. Create database in production mode
3. Set up security rules for user data isolation

### Hosting (Optional)
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Deploy: `firebase deploy`

## 📊 Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── business-plan/  # Business planning sections
│   ├── equipment/      # Equipment planning
│   ├── layout/         # Layout components
│   ├── startup/        # Opening plan and journey
│   └── ui/             # Reusable UI components
├── contexts/           # React Context providers
├── services/           # Firebase and API services
└── pages/              # Main page components
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the `/docs` folder for detailed guides
- **Issues**: Report bugs via GitHub Issues
- **Email**: support@restaurantstartupapp.com

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced financial modeling
- [ ] Integration with POS systems
- [ ] Real-time collaboration
- [ ] Template library
- [ ] Expert consultation booking

## 🙏 Acknowledgments

- Boston Restaurant Market Data
- Local vendor partnerships
- Restaurant industry experts
- Open source community

---

**Built with ❤️ for Boston's restaurant entrepreneurs**