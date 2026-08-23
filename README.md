
````markdown
# 🍽️ Meal Tracker

A React-based web application for managing daily meals, monthly meal records, and payment information in a simple and organized way.

## 🌐 Live Demo

The application is deployed using Firebase Hosting.

**Live Application:**  
https://meal-tracker-19f45.web.app/

---

## 📌 About The Project

Meal Tracker is a web application designed to help users manage their daily lunch and dinner records.

Users can:

- Track daily lunch and dinner
- View monthly meal records
- Track monthly fees
- Record payments
- Check meals taken and remaining
- Configure Sunday meal-off preferences

The application uses **Google Authentication** for user login and **Firebase Realtime Database** for storing user-specific meal and payment data.

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
- 🚫 Sunday Meal-Off Support
- 🔒 Firebase Realtime Database Security Rules
- 📱 Responsive Web Application
- ☁️ Firebase Hosting Deployment

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

The application uses **Firebase Authentication with Google Sign-In**.

Each authenticated user receives a unique Firebase UID.

User data is organized using the authenticated user's Firebase UID:

```text
mealTrackerData/
└── USER_UID/
    ├── meals/
    ├── payments/
    ├── monthlyFee
    └── sundayOffMeal
````

Firebase Realtime Database Security Rules are configured so that:

* 🔒 Unauthenticated users cannot access protected user data.
* 👤 Authenticated users can read their own data.
* ✏️ Authenticated users can write their own data.
* 🚫 Users cannot access another user's data.

Database access is controlled using the authenticated user's Firebase UID.

> **Security Note:** Firebase Web configuration values used by the frontend are not treated as private credentials. Sensitive service-account files, private keys, and other secret credentials must never be committed to the repository.

---

## 🗂️ Project Structure

```text
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
```

---

## 🚀 Run The Project Locally

### 1. Clone the Repository

```bash
git clone https://github.com/akash274545/meal-tracker.git
```

### 2. Navigate to the Project Directory

```bash
cd meal-tracker
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Development Server

```bash
npm run dev
```

The application will start using the Vite development server.

---

## 🏗️ Production Build

To create a production build:

```bash
npm run build
```

The production files will be generated inside:

```text
dist/
```

---

## ☁️ Firebase Deployment

After making changes to the application, create a new production build:

```bash
npm run build
```

Then deploy the latest build to Firebase Hosting:

```bash
firebase deploy
```

The updated application will be available on the Firebase Hosting URL.

---

## 🔄 Development Workflow

```text
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
```

---

## 📋 Project Highlights

* 🔐 Google Authentication
* 👤 Individual user data management
* 🆔 Firebase UID-based database access
* 🔒 Secure Realtime Database Rules
* 🍱 Daily meal management
* 📅 Monthly meal overview
* 💰 Monthly fee tracking
* 💳 Payment tracking
* ☁️ Firebase Cloud Hosting
* 🐙 GitHub version control

---

## 🚀 Future Improvements

Possible future improvements include:

* 📱 Progressive Web App (PWA) support
* 📊 Advanced monthly and yearly statistics
* 📈 Graphical meal reports
* 🔔 Meal reminders
* 📧 Automated reports
* 📄 PDF/Excel report generation
* 👥 Admin dashboard
* 🎨 Further UI/UX improvements

---

## 👨‍💻 Author

**Akash Narayankar**

B.Tech – Information Technology

M.Tech – Computer Engineering

---

## 📄 License

This project is developed for personal and educational use.

````


