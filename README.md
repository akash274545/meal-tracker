# 🍽️ Meal Tracker

A personal web application designed to track daily meals, monthly meal status, and payment information in a simple and organized way.

## 🌐 Live Demo

The application is deployed using Firebase Hosting.

**Live Application:**  
https://meal-tracker-19f45.web.app/

---

## 📌 About The Project

Meal Tracker is a React-based web application that helps users manage their daily lunch and dinner records.

The application uses Google Authentication to identify users and Firebase Realtime Database to securely store user-specific meal and payment data.

Each authenticated user can access only their own data.

---

## ✨ Features

- 🔐 Google Login Authentication
- 👤 User-specific data using Firebase UID
- 🍱 Daily Lunch Tracking
- 🍽️ Daily Dinner Tracking
- 📅 Monthly Meal Dashboard
- 💰 Monthly Fee Tracking
- 💳 Payment Tracking
- 📊 Meals Taken & Remaining
- 🚫 Sunday Meal Off support
- 🔒 Firebase Realtime Database Security Rules
- 📱 Responsive web application
- ☁️ Firebase Hosting deployment

---

## 🛠️ Technologies Used

### Frontend

- React.js
- JavaScript
- HTML5
- CSS3
- Vite

### Backend / Database

- Firebase Authentication
- Firebase Realtime Database

### Authentication

- Google Authentication

### Deployment

- Firebase Hosting

### Version Control

- Git
- GitHub

---

## 🔐 Authentication & Security

The application uses Firebase Authentication with Google Sign-In.

Each authenticated user receives a unique Firebase UID.

User data is organized using the user's Firebase UID:

```text
mealTrackerData/
└── USER_UID/
    ├── meals/
    ├── payments/
    ├── monthlyFee
    └── sundayOffMeal

Firebase Realtime Database Security Rules are configured so that:

Unauthenticated users cannot access protected user data.
Authenticated users can read their own data.
Authenticated users can write their own data.
Users cannot access another user's data.

Database access is controlled using the authenticated user's Firebase UID.

Note: Firebase Web configuration values used by the frontend are not treated as private credentials. Sensitive service-account/private-key files must never be committed to the repository.

🗂️ Project Structure
meal-tracker/
│
├── public/
│
├── src/
│   ├── assets/
│   ├── App.css
│   ├── App.jsx
│   ├── firebase.js
│   ├── index.css
│   └── main.jsx
│
├── .firebaserc
├── .gitignore
├── firebase.json
├── index.html
├── package-lock.json
├── package.json
├── README.md
└── vite.config.js
🚀 Run The Project Locally
1. Clone the repository
git clone https://github.com/akash274545/meal-tracker.git
2. Navigate to the project directory
cd meal-tracker
3. Install dependencies
npm install
4. Start the development server
npm run dev

The application will start using the Vite development server.

🏗️ Production Build

To create a production build:

npm run build

The production files will be generated inside:

dist/
☁️ Firebase Deployment

After making changes to the application:

npm run build

Then deploy the latest production build to Firebase Hosting:

firebase deploy

The application will be updated on the Firebase Hosting URL.

🔄 Development Workflow
Code Changes
     ↓
Test Locally
     ↓
npm run build
     ↓
firebase deploy
     ↓
Live Application Updated
     ↓
git add .
     ↓
git commit
     ↓
git push
     ↓
GitHub Updated
📋 Project Highlights
User authentication through Google
Individual user data management
Firebase UID-based database access
Secure Realtime Database rules
Daily meal management
Monthly meal overview
Payment tracking
Firebase cloud hosting
GitHub version control
🚀 Future Improvements

Possible future improvements include:

📱 Progressive Web App (PWA) support
📊 Advanced monthly and yearly statistics
📈 Graphical meal reports
🔔 Meal reminders
📧 Automated reports
📄 PDF/Excel report generation
👥 Admin dashboard
🎨 Further UI/UX improvements
👨‍💻 Author

Akash Narayankar

B.Tech – Information Technology
M.Tech – Computer Engineering

📄 License

This project is developed for personal and educational use.