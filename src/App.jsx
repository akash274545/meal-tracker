// import { useEffect, useRef, useState } from "react";
// import "./App.css";

// import { database, auth } from "./firebase";
// import { get, ref, set } from "firebase/database";
// import {
//   GoogleAuthProvider,
//   onAuthStateChanged,
//   signInWithPopup,
//   signOut,
// } from "firebase/auth";

// function App() {
//   // ==================================================
//   // FIREBASE AUTHENTICATION
//   // ==================================================

//   const [user, setUser] = useState(null);
//   const [authLoading, setAuthLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//       setAuthLoading(false);
//     });

//     return unsubscribe;
//   }, []);

//   const handleGoogleLogin = async () => {
//     try {
//       const provider = new GoogleAuthProvider();
//       await signInWithPopup(auth, provider);
//     } catch (error) {
//       console.error("Google login error:", error);
//       alert(`Google login failed: ${error.message}`);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//     } catch (error) {
//       console.error("Logout error:", error);
//       alert(`Logout failed: ${error.message}`);
//     }
//   };

//   const firebaseLoaded = useRef(false);
//   // ==================================================
//   // LOAD SAVED MEAL DATA
//   // ==================================================

//   const [meals, setMeals] = useState(() => {
//     const savedMeals = localStorage.getItem("mealTracker");

//     if (!savedMeals) {
//       return {};
//     }

//     const parsedMeals = JSON.parse(savedMeals);
//     const convertedMeals = {};

//     Object.entries(parsedMeals).forEach(([key, value]) => {
//       if (value === true) {
//         convertedMeals[key] = "taken";
//       } else if (value === "taken" || value === "leave") {
//         convertedMeals[key] = value;
//       }
//     });

//     return convertedMeals;
//   });

//   // ==================================================
//   // SUNDAY OFF
//   // ==================================================

//   const [sundayOffMeal, setSundayOffMeal] = useState(() => {
//     return localStorage.getItem("sundayOffMeal") || "dinner";
//   });

//   // ==================================================
//   // CURRENT MONTH
//   // ==================================================

//   const today = new Date();

//   const [year, setYear] = useState(today.getFullYear());
//   const [month, setMonth] = useState(today.getMonth());

//   // ==================================================
//   // PERSONAL LEAVE
//   // ==================================================

//   const [leaveStart, setLeaveStart] = useState("");
//   const [leaveEnd, setLeaveEnd] = useState("");

//   // ==================================================
//   // CLEAR INDIVIDUAL MEAL
//   // ==================================================

//   const [clearMealDate, setClearMealDate] = useState("");
//   const [clearMealType, setClearMealType] = useState("lunch");

//   // ==================================================
//   // PAYMENT DATA
//   // ==================================================

//   const [monthlyFee, setMonthlyFee] = useState(() => {
//     const savedFee = localStorage.getItem("monthlyMessFee");

//     return savedFee ? Number(savedFee) : 3000;
//   });

//   const [payments, setPayments] = useState(() => {
//     const savedPayments = localStorage.getItem("messPayments");

//     return savedPayments ? JSON.parse(savedPayments) : {};
//   });

//   const [paymentAmount, setPaymentAmount] = useState("");
//   const [paymentDate, setPaymentDate] = useState("");
//   const [paymentNote, setPaymentNote] = useState("");

//   // ==================================================
//   // FIREBASE LOAD + SAVE
//   // ==================================================

//   useEffect(() => {
//     if (!user) {
//       return;
//     }

//     const loadFirebaseData = async () => {
//       try {
//         firebaseLoaded.current = false;

//         // ---------------------------------------------
//         // 1. Check data for current Google user
//         // ---------------------------------------------

//         const userDataRef = ref(database, `mealTrackerData/${user.uid}`);

//         const userSnapshot = await get(userDataRef);

//         if (userSnapshot.exists()) {
//           const data = userSnapshot.val();

//           if (data.meals) {
//             setMeals(data.meals);
//           }

//           if (data.sundayOffMeal) {
//             setSundayOffMeal(data.sundayOffMeal);
//           }

//           if (data.monthlyFee !== undefined) {
//             setMonthlyFee(Number(data.monthlyFee));
//           }

//           if (data.payments) {
//             setPayments(data.payments);
//           }

//           console.log("Google user data loaded successfully.");

//           firebaseLoaded.current = true;
//           return;
//         }

//         // ---------------------------------------------
//         // 2. Current user has no data
//         //    Check old Firebase data
//         // ---------------------------------------------

//         const oldDataRef = ref(database, "mealTrackerData");
//         const oldSnapshot = await get(oldDataRef);

//         if (oldSnapshot.exists()) {
//           const oldData = oldSnapshot.val();

//           const oldMeals = oldData.meals;
//           const oldSundayOff = oldData.sundayOffMeal;
//           const oldFee = oldData.monthlyFee;
//           const oldPayments = oldData.payments;

//           // Check whether old data actually exists
//           const hasOldData =
//             oldMeals || oldSundayOff || oldFee !== undefined || oldPayments;

//           if (hasOldData) {
//             const migratedData = {
//               meals: oldMeals || {},
//               sundayOffMeal: oldSundayOff || "dinner",
//               monthlyFee: oldFee !== undefined ? Number(oldFee) : 3000,
//               payments: oldPayments || {},
//             };

//             // ---------------------------------------------
//             // 3. Copy old data to current Google UID
//             // ---------------------------------------------

//             await set(userDataRef, migratedData);

//             // Show migrated data immediately
//             setMeals(migratedData.meals);
//             setSundayOffMeal(migratedData.sundayOffMeal);
//             setMonthlyFee(migratedData.monthlyFee);
//             setPayments(migratedData.payments);

//             console.log("Old Firebase data migrated to Google account.");

//             firebaseLoaded.current = true;
//             return;
//           }
//         }

//         // ---------------------------------------------
//         // 4. Completely new user
//         // ---------------------------------------------

//         setMeals({});
//         setSundayOffMeal("dinner");
//         setMonthlyFee(3000);
//         setPayments({});

//         console.log("No existing data found. New user account created.");

//         firebaseLoaded.current = true;
//       } catch (error) {
//         console.error("Firebase load error:", error);

//         firebaseLoaded.current = true;
//       }
//     };

//     loadFirebaseData();
//   }, [user]);

//   // --------------------------------------------------
//   // SAVE MEALS TO FIREBASE
//   // --------------------------------------------------

//   useEffect(() => {
//     if (!firebaseLoaded.current || !user) {
//       return;
//     }

//     const dataRef = ref(database, `mealTrackerData/${user.uid}/meals`);

//     set(dataRef, meals).catch((error) => {
//       console.error("Failed to save meals:", error);
//     });

//     // Local backup
//     localStorage.setItem(`mealTracker_${user.uid}`, JSON.stringify(meals));
//   }, [meals, user]);

//   // --------------------------------------------------
//   // SAVE SUNDAY SETTING
//   // --------------------------------------------------

//   useEffect(() => {
//     if (!firebaseLoaded.current || !user) {
//       return;
//     }

//     const dataRef = ref(database, `mealTrackerData/${user.uid}/sundayOffMeal`);

//     set(dataRef, sundayOffMeal).catch((error) => {
//       console.error("Failed to save Sunday setting:", error);
//     });

//     // Local backup
//     localStorage.setItem(`sundayOffMeal_${user.uid}`, sundayOffMeal);
//   }, [sundayOffMeal, user]);

//   // --------------------------------------------------
//   // SAVE MONTHLY FEE
//   // --------------------------------------------------

//   useEffect(() => {
//     if (!firebaseLoaded.current || !user) {
//       return;
//     }

//     const dataRef = ref(database, `mealTrackerData/${user.uid}/monthlyFee`);

//     set(dataRef, monthlyFee).catch((error) => {
//       console.error("Failed to save monthly fee:", error);
//     });

//     // Local backup
//     localStorage.setItem(`monthlyMessFee_${user.uid}`, monthlyFee.toString());
//   }, [monthlyFee, user]);

//   // --------------------------------------------------
//   // SAVE PAYMENTS
//   // --------------------------------------------------

//   useEffect(() => {
//     if (!firebaseLoaded.current || !user) {
//       return;
//     }

//     const dataRef = ref(database, `mealTrackerData/${user.uid}/payments`);

//     set(dataRef, payments).catch((error) => {
//       console.error("Failed to save payments:", error);
//     });

//     // Local backup
//     localStorage.setItem(`messPayments_${user.uid}`, JSON.stringify(payments));
//   }, [payments, user]);

//   // ==================================================
//   // MONTH INFORMATION
//   // ==================================================

//   const monthName = new Date(year, month).toLocaleString("default", {
//     month: "long",
//   });

//   const daysInMonth = new Date(year, month + 1, 0).getDate();

//   // 31 days = 62
//   // 30 days = 60
//   // 29 days = 58
//   // 28 days = 56

//   const monthlyAllowance = daysInMonth * 2;

//   // ==================================================
//   // TODAY
//   // ==================================================

//   const todayYear = today.getFullYear();
//   const todayMonth = today.getMonth();
//   const todayDate = today.getDate();

//   // ==================================================
//   // MEAL KEY
//   // ==================================================

//   const getMealKey = (selectedYear, selectedMonth, day, mealType) => {
//     return `${selectedYear}-${selectedMonth + 1}-${day}-${mealType}`;
//   };

//   // ==================================================
//   // CHECK SUNDAY
//   // ==================================================

//   const isSunday = (selectedYear, selectedMonth, day) => {
//     const date = new Date(selectedYear, selectedMonth, day);

//     return date.getDay() === 0;
//   };

//   // ==================================================
//   // SUNDAY OFF
//   // ==================================================

//   const isSundayOff = (selectedYear, selectedMonth, day, mealType) => {
//     return (
//       sundayOffMeal !== "none" &&
//       isSunday(selectedYear, selectedMonth, day) &&
//       sundayOffMeal === mealType
//     );
//   };

//   // ==================================================
//   // GET MEAL STATUS
//   // ==================================================

//   const getMealStatus = (selectedYear, selectedMonth, day, mealType) => {
//     if (isSundayOff(selectedYear, selectedMonth, day, mealType)) {
//       return "off";
//     }

//     const key = getMealKey(selectedYear, selectedMonth, day, mealType);

//     return meals[key] || "empty";
//   };

//   // ==================================================
//   // TOGGLE MEAL
//   // Empty → Taken → Leave → Empty
//   // ==================================================

//   const toggleMeal = (day, mealType) => {
//     if (isSundayOff(year, month, day, mealType)) {
//       return;
//     }

//     const key = getMealKey(year, month, day, mealType);

//     setMeals((previous) => {
//       const currentStatus = previous[key] || "empty";

//       let nextStatus;

//       if (currentStatus === "empty") {
//         nextStatus = "taken";
//       } else if (currentStatus === "taken") {
//         nextStatus = "leave";
//       } else {
//         nextStatus = "empty";
//       }

//       const updated = {
//         ...previous,
//       };

//       if (nextStatus === "empty") {
//         delete updated[key];
//       } else {
//         updated[key] = nextStatus;
//       }

//       return updated;
//     });
//   };

//   // ==================================================
//   // MONTHLY MEAL COUNTS
//   // ==================================================

//   let takenMeals = 0;
//   let personalLeaveMeals = 0;
//   let sundayOffCount = 0;

//   for (let day = 1; day <= daysInMonth; day++) {
//     if (isSundayOff(year, month, day, sundayOffMeal)) {
//       sundayOffCount++;
//     }

//     const lunchStatus = getMealStatus(year, month, day, "lunch");

//     const dinnerStatus = getMealStatus(year, month, day, "dinner");

//     if (lunchStatus === "taken") {
//       takenMeals++;
//     }

//     if (dinnerStatus === "taken") {
//       takenMeals++;
//     }

//     if (lunchStatus === "leave") {
//       personalLeaveMeals++;
//     }

//     if (dinnerStatus === "leave") {
//       personalLeaveMeals++;
//     }
//   }

//   const adjustedAllowance = monthlyAllowance - personalLeaveMeals;

//   const remainingMeals = Math.max(adjustedAllowance - takenMeals, 0);

//   // ==================================================
//   // TODAY STATUS
//   // ==================================================

//   const isTodayVisible = year === todayYear && month === todayMonth;

//   const todayLunchStatus = getMealStatus(
//     todayYear,
//     todayMonth,
//     todayDate,
//     "lunch",
//   );

//   const todayDinnerStatus = getMealStatus(
//     todayYear,
//     todayMonth,
//     todayDate,
//     "dinner",
//   );

//   // ==================================================
//   // CHANGE MONTH
//   // ==================================================

//   const changeMonth = (direction) => {
//     let newMonth = month + direction;
//     let newYear = year;

//     if (newMonth > 11) {
//       newMonth = 0;
//       newYear++;
//     }

//     if (newMonth < 0) {
//       newMonth = 11;
//       newYear--;
//     }

//     setMonth(newMonth);
//     setYear(newYear);
//   };

//   // ==================================================
//   // GO TO TODAY
//   // ==================================================

//   const goToToday = () => {
//     setYear(todayYear);
//     setMonth(todayMonth);
//   };

//   // ==================================================
//   // APPLY LEAVE RANGE
//   // ==================================================

//   const applyLeaveRange = () => {
//     if (!leaveStart || !leaveEnd) {
//       alert("Please select start and end dates.");
//       return;
//     }

//     const start = new Date(`${leaveStart}T00:00:00`);
//     const end = new Date(`${leaveEnd}T00:00:00`);

//     if (start > end) {
//       alert("End date must be after start date.");
//       return;
//     }

//     setMeals((previous) => {
//       const updated = {
//         ...previous,
//       };

//       const current = new Date(start);

//       while (current <= end) {
//         const selectedYear = current.getFullYear();
//         const selectedMonth = current.getMonth();
//         const day = current.getDate();

//         if (selectedYear === year && selectedMonth === month) {
//           if (!isSundayOff(selectedYear, selectedMonth, day, "lunch")) {
//             const lunchKey = getMealKey(
//               selectedYear,
//               selectedMonth,
//               day,
//               "lunch",
//             );

//             updated[lunchKey] = "leave";
//           }

//           if (!isSundayOff(selectedYear, selectedMonth, day, "dinner")) {
//             const dinnerKey = getMealKey(
//               selectedYear,
//               selectedMonth,
//               day,
//               "dinner",
//             );

//             updated[dinnerKey] = "leave";
//           }
//         }

//         current.setDate(current.getDate() + 1);
//       }

//       return updated;
//     });

//     setLeaveStart("");
//     setLeaveEnd("");
//   };

//   // ==================================================
//   // CLEAR LEAVE RANGE
//   // ==================================================

//   const clearLeaveRange = () => {
//     if (!leaveStart || !leaveEnd) {
//       alert("Please select start and end dates.");
//       return;
//     }

//     const start = new Date(`${leaveStart}T00:00:00`);
//     const end = new Date(`${leaveEnd}T00:00:00`);

//     if (start > end) {
//       alert("End date must be after start date.");
//       return;
//     }

//     setMeals((previous) => {
//       const updated = {
//         ...previous,
//       };

//       const current = new Date(start);

//       while (current <= end) {
//         const selectedYear = current.getFullYear();
//         const selectedMonth = current.getMonth();
//         const day = current.getDate();

//         if (selectedYear === year && selectedMonth === month) {
//           const lunchKey = getMealKey(
//             selectedYear,
//             selectedMonth,
//             day,
//             "lunch",
//           );

//           const dinnerKey = getMealKey(
//             selectedYear,
//             selectedMonth,
//             day,
//             "dinner",
//           );

//           if (updated[lunchKey] === "leave") {
//             delete updated[lunchKey];
//           }

//           if (updated[dinnerKey] === "leave") {
//             delete updated[dinnerKey];
//           }
//         }

//         current.setDate(current.getDate() + 1);
//       }

//       return updated;
//     });

//     setLeaveStart("");
//     setLeaveEnd("");
//   };

//   // ==================================================
//   // CLEAR INDIVIDUAL MEAL
//   // ==================================================

//   const clearIndividualMeal = () => {
//     if (!clearMealDate) {
//       alert("Please select a date.");
//       return;
//     }

//     const selectedDate = new Date(`${clearMealDate}T00:00:00`);

//     const selectedYear = selectedDate.getFullYear();
//     const selectedMonth = selectedDate.getMonth();
//     const selectedDay = selectedDate.getDate();

//     const key = getMealKey(
//       selectedYear,
//       selectedMonth,
//       selectedDay,
//       clearMealType,
//     );

//     if (meals[key] !== "leave") {
//       alert(
//         `No personal leave found for ${
//           clearMealType === "lunch" ? "Lunch" : "Dinner"
//         } on ${clearMealDate}.`,
//       );

//       return;
//     }

//     setMeals((previous) => {
//       const updated = {
//         ...previous,
//       };

//       delete updated[key];

//       return updated;
//     });

//     setClearMealDate("");
//   };

//   // ==================================================
//   // PAYMENT FUNCTIONS
//   // ==================================================

//   const getPaymentKey = (selectedYear, selectedMonth) => {
//     return `${selectedYear}-${selectedMonth + 1}`;
//   };

//   const currentPaymentKey = getPaymentKey(year, month);

//   const currentMonthPayments = payments[currentPaymentKey] || [];

//   const totalPaid = currentMonthPayments.reduce(
//     (total, payment) => total + Number(payment.amount),
//     0,
//   );

//   const remainingAmount = Math.max(Number(monthlyFee) - totalPaid, 0);

//   const paymentStatus =
//     totalPaid >= Number(monthlyFee)
//       ? "Fully Paid"
//       : totalPaid > 0
//         ? "Partially Paid"
//         : "Not Paid";

//   // ==================================================
//   // ADD PAYMENT
//   // ==================================================

//   // ==================================================
//   // ADD PAYMENT
//   // ==================================================

//   const addPayment = () => {
//     const amount = Number(paymentAmount);

//     if (!paymentAmount || amount <= 0) {
//       alert("Please enter a valid payment amount.");
//       return;
//     }

//     if (amount > remainingAmount) {
//       alert(`Maximum remaining amount is ₹${remainingAmount}.`);
//       return;
//     }

//     const selectedPaymentDate =
//       paymentDate ||
//       `${year}-${String(month + 1).padStart(2, "0")}-${String(
//         todayDate,
//       ).padStart(2, "0")}`;

//     const existingPayments = payments[currentPaymentKey] || [];

//     const paidBefore = existingPayments.reduce(
//       (total, payment) => total + Number(payment.amount),
//       0,
//     );

//     const paidAfter = paidBefore + amount;

//     // --------------------------------------------------
//     // AUTOMATIC PAYMENT TYPE
//     // --------------------------------------------------

//     let paymentType = "";

//     // Direct full month payment
//     if (paidBefore === 0 && amount >= Number(monthlyFee)) {
//       paymentType = "Full Month Payment";
//     }

//     // First installment
//     else if (paidBefore === 0) {
//       paymentType = "1st Installment";
//     }

//     // Second installment completes the month
//     else if (paidAfter >= Number(monthlyFee)) {
//       paymentType = "2nd Installment";
//     }

//     // Any additional installment
//     else {
//       paymentType = `${existingPayments.length + 1}th Installment`;
//     }

//     const newPayment = {
//       id: Date.now(),
//       amount: amount,
//       date: selectedPaymentDate,

//       // Keep user's note if entered
//       note: paymentNote.trim() || paymentType,

//       // New automatic installment information
//       paymentType: paymentType,
//     };

//     setPayments((previous) => ({
//       ...previous,
//       [currentPaymentKey]: [...(previous[currentPaymentKey] || []), newPayment],
//     }));

//     setPaymentAmount("");
//     setPaymentDate("");
//     setPaymentNote("");
//   };

//   // ==================================================
//   // DELETE PAYMENT
//   // ==================================================

//   const deletePayment = (paymentId) => {
//     const confirmed = window.confirm("Delete this payment?");

//     if (!confirmed) {
//       return;
//     }

//     setPayments((previous) => ({
//       ...previous,
//       [currentPaymentKey]: (previous[currentPaymentKey] || []).filter(
//         (payment) => payment.id !== paymentId,
//       ),
//     }));
//   };

//   // ==================================================
//   // YEARLY PAYMENT DATA
//   // ==================================================

//   const yearlyPaymentData = Array.from({ length: 12 }, (_, index) => {
//     const monthKey = `${year}-${index + 1}`;

//     const monthPayments = payments[monthKey] || [];

//     const paid = monthPayments.reduce(
//       (total, payment) => total + Number(payment.amount),
//       0,
//     );

//     const remaining = Math.max(Number(monthlyFee) - paid, 0);

//     let status = "Not Paid";

//     if (paid >= Number(monthlyFee)) {
//       status = "Fully Paid";
//     } else if (paid > 0) {
//       status = "Partially Paid";
//     }

//     return {
//       month: index,
//       monthName: new Date(year, index).toLocaleString("default", {
//         month: "long",
//       }),
//       fee: Number(monthlyFee),
//       paid,
//       remaining,
//       status,
//     };
//   });

//   const yearlyTotalFee = yearlyPaymentData.reduce(
//     (total, item) => total + item.fee,
//     0,
//   );

//   const yearlyTotalPaid = yearlyPaymentData.reduce(
//     (total, item) => total + item.paid,
//     0,
//   );

//   const yearlyTotalRemaining = yearlyPaymentData.reduce(
//     (total, item) => total + item.remaining,
//     0,
//   );

//   const fullyPaidMonths = yearlyPaymentData.filter(
//     (item) => item.status === "Fully Paid",
//   ).length;

//   const partiallyPaidMonths = yearlyPaymentData.filter(
//     (item) => item.status === "Partially Paid",
//   ).length;

//   const unpaidMonths = yearlyPaymentData.filter(
//     (item) => item.status === "Not Paid",
//   ).length;

//   // ==================================================
//   // STATUS SYMBOL
//   // ==================================================

//   const getStatusSymbol = (status) => {
//     if (status === "taken") {
//       return "✓";
//     }

//     if (status === "leave") {
//       return "🏖️";
//     }

//     if (status === "off") {
//       return "OFF";
//     }

//     return "○";
//   };

//   // ==================================================
//   // UI
//   // ==================================================

//   if (authLoading) {
//     return (
//       <div className="app auth-screen">
//         <div className="auth-card">
//           <h1>🍽️ Meal Tracker</h1>
//           <p>Checking your login...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div className="app auth-screen">
//         <div className="auth-card">
//           <h1>🍽️ Meal Tracker</h1>
//           <p>Login to access your personal meal and payment tracker.</p>
//           <button className="google-login-button" onClick={handleGoogleLogin}>
//             Continue with Google
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="app">
//       {/* HEADER */}

//       <header className="header">
//         <h1>🍽️ Meal Tracker</h1>
//         <p>Track your daily lunch and dinner</p>
//         <div className="user-bar">
//           <span>{user.displayName || user.email}</span>
//           <button onClick={handleLogout}>Logout</button>
//         </div>
//       </header>
//       <main className="container">
//         {/* TODAY'S STATUS */}

//         {isTodayVisible && (
//           <div className="today-section">
//             <div className="today-title">
//               <h2>📅 Today's Status</h2>

//               <p>
//                 {todayDate} {monthName} {todayYear}
//               </p>
//             </div>

//             <div className="today-meals">
//               {/* LUNCH */}

//               <div
//                 className={`today-meal ${
//                   todayLunchStatus === "taken" ? "meal-done" : ""
//                 }`}
//               >
//                 <div className="today-meal-icon">🍛</div>

//                 <div className="today-meal-info">
//                   <h3>Lunch</h3>

//                   <p>
//                     {todayLunchStatus === "taken" && "✓ Taken"}

//                     {todayLunchStatus === "leave" && "🏖️ Personal Leave"}

//                     {todayLunchStatus === "off" && "🚫 Sunday OFF"}

//                     {todayLunchStatus === "empty" && "○ Not Taken"}
//                   </p>
//                 </div>
//               </div>

//               {/* DINNER */}

//               <div
//                 className={`today-meal ${
//                   todayDinnerStatus === "taken" ? "meal-done" : ""
//                 }`}
//               >
//                 <div className="today-meal-icon">🍽️</div>

//                 <div className="today-meal-info">
//                   <h3>Dinner</h3>

//                   <p>
//                     {todayDinnerStatus === "taken" && "✓ Taken"}

//                     {todayDinnerStatus === "leave" && "🏖️ Personal Leave"}

//                     {todayDinnerStatus === "off" && "🚫 Sunday OFF"}

//                     {todayDinnerStatus === "empty" && "○ Not Taken"}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* MONTH NAVIGATION */}

//         <div className="month-navigation">
//           <button onClick={() => changeMonth(-1)}>←</button>

//           <h2>
//             {monthName} {year}
//           </h2>

//           <button onClick={() => changeMonth(1)}>→</button>
//         </div>

//         {/* ==================================================
//             MONTHLY DASHBOARD
//             ================================================== */}

//         <div className="dashboard-card">
//           <div className="dashboard-header">
//             <div>
//               <h2>
//                 📊 {monthName} {year} Dashboard
//               </h2>
//               <p>Your complete monthly mess overview</p>
//             </div>
//           </div>

//           {/* DASHBOARD STATS */}

//           <div className="dashboard-stats">
//             <div className="dashboard-stat">
//               <span>🍛</span>
//               <p>Meals Taken</p>
//               <strong>{takenMeals}</strong>
//             </div>

//             <div className="dashboard-stat">
//               <span>🏖️</span>
//               <p>Leave Meals</p>
//               <strong>{personalLeaveMeals}</strong>
//             </div>

//             <div className="dashboard-stat">
//               <span>⏳</span>
//               <p>Meals Remaining</p>
//               <strong>{remainingMeals}</strong>
//             </div>

//             <div className="dashboard-stat">
//               <span>💰</span>
//               <p>Paid</p>
//               <strong>₹{totalPaid.toLocaleString("en-IN")}</strong>
//             </div>

//             <div className="dashboard-stat">
//               <span>💳</span>
//               <p>Payment Remaining</p>
//               <strong>₹{remainingAmount.toLocaleString("en-IN")}</strong>
//             </div>

//             <div className="dashboard-stat">
//               <span>
//                 {paymentStatus === "Fully Paid"
//                   ? "🟢"
//                   : paymentStatus === "Partially Paid"
//                     ? "🟡"
//                     : "🔴"}
//               </span>

//               <p>Payment Status</p>

//               <strong className="dashboard-status-text">{paymentStatus}</strong>
//             </div>
//           </div>

//           {/* MEAL PROGRESS */}

//           <div className="dashboard-progress-section">
//             <div className="dashboard-progress-header">
//               <strong>🍽️ Meal Progress</strong>

//               <span>
//                 {takenMeals} / {adjustedAllowance}
//               </span>
//             </div>

//             <div className="progress-bar">
//               <div
//                 className="progress-fill meal-progress"
//                 style={{
//                   width:
//                     adjustedAllowance > 0
//                       ? `${Math.min(
//                           (takenMeals / adjustedAllowance) * 100,
//                           100,
//                         )}%`
//                       : "0%",
//                 }}
//               ></div>
//             </div>

//             <p className="progress-text">
//               {takenMeals} meals taken out of {adjustedAllowance} available
//               meals
//             </p>
//           </div>

//           {/* PAYMENT PROGRESS */}

//           <div className="dashboard-progress-section">
//             <div className="dashboard-progress-header">
//               <strong>💰 Payment Progress</strong>

//               <span>
//                 ₹{totalPaid.toLocaleString("en-IN")} / ₹
//                 {Number(monthlyFee).toLocaleString("en-IN")}
//               </span>
//             </div>

//             <div className="progress-bar">
//               <div
//                 className="progress-fill payment-progress"
//                 style={{
//                   width:
//                     Number(monthlyFee) > 0
//                       ? `${Math.min(
//                           (totalPaid / Number(monthlyFee)) * 100,
//                           100,
//                         )}%`
//                       : "0%",
//                 }}
//               ></div>
//             </div>

//             <p className="progress-text">
//               ₹{totalPaid.toLocaleString("en-IN")} paid out of ₹
//               {Number(monthlyFee).toLocaleString("en-IN")}
//             </p>
//           </div>
//         </div>

//         {/* GO TO TODAY */}

//         {!isTodayVisible && (
//           <div className="today-button-container">
//             <button className="go-today-button" onClick={goToToday}>
//               📅 Go to Today
//             </button>
//           </div>
//         )}

//         {/* SUNDAY SETTING */}

//         <div className="settings-card">
//           <div>
//             <h3>🚫 Sunday Weekly OFF</h3>

//             <p>Choose which one meal is OFF every Sunday.</p>
//           </div>

//           <select
//             value={sundayOffMeal}
//             onChange={(event) => setSundayOffMeal(event.target.value)}
//           >
//             <option value="lunch">🍛 Lunch OFF</option>

//             <option value="dinner">🍽️ Dinner OFF</option>

//             <option value="none">No Sunday OFF</option>
//           </select>
//         </div>

//         {/* PERSONAL LEAVE */}

//         <div className="leave-card">
//           <div className="leave-header">
//             <div>
//               <h3>🏖️ Personal Leave</h3>

//               <p>Take leave for one day or multiple days.</p>
//             </div>
//           </div>

//           <div className="leave-controls">
//             <div>
//               <label>Start Date</label>

//               <input
//                 type="date"
//                 value={leaveStart}
//                 onChange={(event) => setLeaveStart(event.target.value)}
//               />
//             </div>

//             <div>
//               <label>End Date</label>

//               <input
//                 type="date"
//                 value={leaveEnd}
//                 onChange={(event) => setLeaveEnd(event.target.value)}
//               />
//             </div>

//             <button className="apply-leave" onClick={applyLeaveRange}>
//               🏖️ Apply Leave
//             </button>

//             <button className="clear-leave" onClick={clearLeaveRange}>
//               Clear Leave
//             </button>
//           </div>

//           <p className="leave-help">
//             Example: Start = 10 March, End = 17 March → 8 days leave. Sunday OFF
//             is automatically excluded from personal leave calculation.
//           </p>
//         </div>

//         {/* CLEAR INDIVIDUAL MEAL */}

//         <div className="clear-meal-card">
//           <div className="clear-meal-header">
//             <h3>🧹 Clear Individual Meal</h3>

//             <p>Clear only one Lunch or Dinner leave.</p>
//           </div>

//           <div className="clear-meal-controls">
//             <div>
//               <label>Select Date</label>

//               <input
//                 type="date"
//                 value={clearMealDate}
//                 onChange={(event) => setClearMealDate(event.target.value)}
//               />
//             </div>

//             <div>
//               <label>Select Meal</label>

//               <select
//                 value={clearMealType}
//                 onChange={(event) => setClearMealType(event.target.value)}
//               >
//                 <option value="lunch">🍛 Lunch</option>

//                 <option value="dinner">🍽️ Dinner</option>
//               </select>
//             </div>

//             <button
//               className="clear-individual-button"
//               onClick={clearIndividualMeal}
//             >
//               🧹 Clear Meal
//             </button>
//           </div>

//           <p className="clear-meal-help">
//             Select a date and meal to clear only that individual personal leave.
//           </p>
//         </div>

//         {/* ==================================================
//             MONTHLY PAYMENT
//             ================================================== */}

//         <div className="payment-card">
//           <div className="payment-header">
//             <div>
//               <h2>💰 Monthly Payment</h2>

//               <p>
//                 Manage your mess payment for{" "}
//                 <strong>
//                   {monthName} {year}
//                 </strong>
//               </p>
//             </div>

//             <div
//               className={`payment-status ${
//                 paymentStatus === "Fully Paid"
//                   ? "paid"
//                   : paymentStatus === "Partially Paid"
//                     ? "partial"
//                     : "not-paid"
//               }`}
//             >
//               {paymentStatus === "Fully Paid" && "🟢 Fully Paid"}

//               {paymentStatus === "Partially Paid" && "🟡 Partially Paid"}

//               {paymentStatus === "Not Paid" && "🔴 Not Paid"}
//             </div>
//           </div>

//           {/* PAYMENT SUMMARY */}

//           <div className="payment-summary">
//             <div>
//               <span>Monthly Fee</span>

//               <strong>₹{Number(monthlyFee).toLocaleString("en-IN")}</strong>
//             </div>

//             <div>
//               <span>Total Paid</span>

//               <strong>₹{totalPaid.toLocaleString("en-IN")}</strong>
//             </div>

//             <div>
//               <span>Remaining</span>

//               <strong>₹{remainingAmount.toLocaleString("en-IN")}</strong>
//             </div>
//           </div>

//           {/* MONTHLY FEE */}

//           <div className="fee-setting">
//             <label>Monthly Mess Fee</label>

//             <div className="fee-input-row">
//               <span>₹</span>

//               <input
//                 type="number"
//                 min="0"
//                 value={monthlyFee}
//                 onChange={(event) => setMonthlyFee(Number(event.target.value))}
//               />
//             </div>
//           </div>

//           {/* ADD PAYMENT */}

//           {remainingAmount > 0 && (
//             <div className="add-payment-section">
//               <h3>➕ Add Payment</h3>

//               <div className="payment-form">
//                 <div>
//                   <label>Amount</label>

//                   <input
//                     type="number"
//                     min="1"
//                     max={remainingAmount}
//                     placeholder="₹1500"
//                     value={paymentAmount}
//                     onChange={(event) => setPaymentAmount(event.target.value)}
//                   />
//                 </div>

//                 <div>
//                   <label>Payment Date</label>

//                   <input
//                     type="date"
//                     value={paymentDate}
//                     onChange={(event) => setPaymentDate(event.target.value)}
//                   />
//                 </div>

//                 <div>
//                   <label>Note</label>

//                   <input
//                     type="text"
//                     placeholder="First installment"
//                     value={paymentNote}
//                     onChange={(event) => setPaymentNote(event.target.value)}
//                   />
//                 </div>

//                 <button className="add-payment-button" onClick={addPayment}>
//                   💰 Save Payment
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* PAYMENT HISTORY */}

//           <div className="payment-history">
//             <h3>📜 Payment History</h3>

//             {currentMonthPayments.length === 0 ? (
//               <div className="no-payment">
//                 No payment recorded for this month.
//               </div>
//             ) : (
//               <div className="payment-list">
//                 {currentMonthPayments
//                   .slice()
//                   .sort((a, b) => new Date(b.date) - new Date(a.date))
//                   .map((payment) => (
//                     <div className="payment-history-item" key={payment.id}>
//                       <div className="payment-history-date">
//                         📅 {payment.date}
//                       </div>

//                       <div className="payment-history-note">
//                         <strong>{payment.paymentType || payment.note}</strong>

//                         {payment.paymentType &&
//                           payment.note !== payment.paymentType && (
//                             <small>{payment.note}</small>
//                           )}
//                       </div>

//                       <strong className="payment-history-amount">
//                         ₹{Number(payment.amount).toLocaleString("en-IN")}
//                       </strong>

//                       <button
//                         className="delete-payment"
//                         onClick={() => deletePayment(payment.id)}
//                       >
//                         🗑️
//                       </button>
//                     </div>
//                   ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* ==================================================
//             YEARLY PAYMENT HISTORY
//             ================================================== */}

//         <div className="yearly-history-card">
//           <div className="yearly-history-header">
//             <div>
//               <h2>📊 {year} Yearly Payment History</h2>

//               <p>Complete mess payment summary for the year.</p>
//             </div>
//           </div>

//           {/* YEARLY SUMMARY */}

//           <div className="yearly-summary">
//             <div className="yearly-summary-card">
//               <span>💰</span>

//               <p>Total Annual Fee</p>

//               <strong>₹{yearlyTotalFee.toLocaleString("en-IN")}</strong>
//             </div>

//             <div className="yearly-summary-card">
//               <span>✅</span>

//               <p>Total Paid</p>

//               <strong>₹{yearlyTotalPaid.toLocaleString("en-IN")}</strong>
//             </div>

//             <div className="yearly-summary-card">
//               <span>⏳</span>

//               <p>Total Remaining</p>

//               <strong>₹{yearlyTotalRemaining.toLocaleString("en-IN")}</strong>
//             </div>

//             <div className="yearly-summary-card">
//               <span>🟢</span>

//               <p>Fully Paid Months</p>

//               <strong>{fullyPaidMonths}</strong>
//             </div>

//             <div className="yearly-summary-card">
//               <span>🟡</span>

//               <p>Partial Months</p>

//               <strong>{partiallyPaidMonths}</strong>
//             </div>

//             <div className="yearly-summary-card">
//               <span>🔴</span>

//               <p>Unpaid Months</p>

//               <strong>{unpaidMonths}</strong>
//             </div>
//           </div>

//           {/* YEARLY MONTHLY TABLE */}

//           <div className="yearly-table-container">
//             <table>
//               <thead>
//                 <tr>
//                   <th>Month</th>

//                   <th>Mess Fee</th>

//                   <th>Paid</th>

//                   <th>Remaining</th>

//                   <th>Status</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {yearlyPaymentData.map((item) => (
//                   <tr key={item.month}>
//                     <td>
//                       <strong>{item.monthName}</strong>
//                     </td>

//                     <td>₹{item.fee.toLocaleString("en-IN")}</td>

//                     <td className="yearly-paid">
//                       ₹{item.paid.toLocaleString("en-IN")}
//                     </td>

//                     <td className="yearly-remaining">
//                       ₹{item.remaining.toLocaleString("en-IN")}
//                     </td>

//                     <td>
//                       <span
//                         className={`yearly-status ${
//                           item.status === "Fully Paid"
//                             ? "yearly-paid-status"
//                             : item.status === "Partially Paid"
//                               ? "yearly-partial-status"
//                               : "yearly-unpaid-status"
//                         }`}
//                       >
//                         {item.status === "Fully Paid" && "🟢 Fully Paid"}

//                         {item.status === "Partially Paid" && "🟡 Partial"}

//                         {item.status === "Not Paid" && "🔴 Not Paid"}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* ==================================================
//             MEAL SUMMARY
//             ================================================== */}

//         <div className="summary">
//           <div className="summary-card">
//             <span>📅</span>

//             <p>Calendar Days</p>

//             <strong>{daysInMonth}</strong>
//           </div>

//           <div className="summary-card">
//             <span>🍽️</span>

//             <p>Monthly Allowance</p>

//             <strong>{monthlyAllowance}</strong>
//           </div>

//           <div className="summary-card">
//             <span>🏖️</span>

//             <p>Leave Meals</p>

//             <strong>{personalLeaveMeals}</strong>
//           </div>

//           <div className="summary-card">
//             <span>🎯</span>

//             <p>Adjusted Allowance</p>

//             <strong>{adjustedAllowance}</strong>
//           </div>

//           <div className="summary-card">
//             <span>✅</span>

//             <p>Meals Taken</p>

//             <strong>{takenMeals}</strong>
//           </div>

//           <div className="summary-card total">
//             <span>⏳</span>

//             <p>Remaining</p>

//             <strong>{remainingMeals}</strong>
//           </div>
//         </div>

//         {/* SUNDAY INFO */}

//         <div className="info-box">
//           <span>🚫</span>

//           <p>
//             Sundays with{" "}
//             <strong>
//               {sundayOffMeal === "lunch"
//                 ? "Lunch"
//                 : sundayOffMeal === "dinner"
//                   ? "Dinner"
//                   : "no meal"}
//             </strong>{" "}
//             OFF are not deducted from your monthly allowance.
//           </p>

//           <strong>
//             Sunday OFF: {sundayOffMeal === "none" ? 0 : sundayOffCount}
//           </strong>
//         </div>

//         {/* MEAL TABLE */}

//         <div className="meal-table-container">
//           <table>
//             <thead>
//               <tr>
//                 <th>Date</th>

//                 <th>Day</th>

//                 <th>🍛 Lunch</th>

//                 <th>🍽️ Dinner</th>
//               </tr>
//             </thead>

//             <tbody>
//               {Array.from(
//                 {
//                   length: daysInMonth,
//                 },
//                 (_, index) => {
//                   const day = index + 1;

//                   const date = new Date(year, month, day);

//                   const dayName = date.toLocaleString("default", {
//                     weekday: "short",
//                   });

//                   const isToday =
//                     year === todayYear &&
//                     month === todayMonth &&
//                     day === todayDate;

//                   const lunchStatus = getMealStatus(year, month, day, "lunch");

//                   const dinnerStatus = getMealStatus(
//                     year,
//                     month,
//                     day,
//                     "dinner",
//                   );

//                   return (
//                     <tr key={day} className={isToday ? "today-row" : ""}>
//                       {/* DATE */}

//                       <td>
//                         {day}

//                         {isToday && <span className="today-label">TODAY</span>}
//                       </td>

//                       {/* DAY */}

//                       <td>{dayName}</td>

//                       {/* LUNCH */}

//                       <td>
//                         <button
//                           disabled={lunchStatus === "off"}
//                           className={`meal-button ${
//                             lunchStatus === "taken" ? "taken" : ""
//                           } ${lunchStatus === "leave" ? "leave" : ""} ${
//                             lunchStatus === "off" ? "off" : ""
//                           }`}
//                           onClick={() => toggleMeal(day, "lunch")}
//                         >
//                           {getStatusSymbol(lunchStatus)}
//                         </button>
//                       </td>

//                       {/* DINNER */}

//                       <td>
//                         <button
//                           disabled={dinnerStatus === "off"}
//                           className={`meal-button ${
//                             dinnerStatus === "taken" ? "taken" : ""
//                           } ${dinnerStatus === "leave" ? "leave" : ""} ${
//                             dinnerStatus === "off" ? "off" : ""
//                           }`}
//                           onClick={() => toggleMeal(day, "dinner")}
//                         >
//                           {getStatusSymbol(dinnerStatus)}
//                         </button>
//                       </td>
//                     </tr>
//                   );
//                 },
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* LEGEND */}

//         <div className="legend">
//           <div>
//             <span className="legend-circle taken">✓</span>
//             Taken
//           </div>

//           <div>
//             <span className="legend-circle leave">🏖️</span>
//             Personal Leave
//           </div>

//           <div>
//             <span className="legend-circle off">OFF</span>
//             Sunday OFF
//           </div>

//           <div>
//             <span className="legend-circle empty">○</span>
//             Not Marked
//           </div>
//         </div>

//         {/* INSTRUCTION */}

//         <div className="instruction-box">
//           <strong>💡 Meal Button:</strong>

//           <span>
//             Click once = Taken → Click again = Personal Leave → Click again =
//             Clear
//           </span>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default App;

import { useEffect, useRef, useState } from "react";
import "./App.css";

import { database, auth } from "./firebase";
import { get, ref, set } from "firebase/database";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";

function App() {
  // ==================================================
  // FIREBASE AUTHENTICATION
  // ==================================================

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();

      provider.setCustomParameters({
        prompt: "select_account",
      });

      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google login error:", error);
      alert(`Google login failed: ${error.message}`);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
      alert(`Logout failed: ${error.message}`);
    }
  };

  const firebaseLoaded = useRef(false);
  // ==================================================
  // LOAD SAVED MEAL DATA
  // ==================================================

  const [meals, setMeals] = useState(() => {
    const savedMeals = localStorage.getItem("mealTracker");

    if (!savedMeals) {
      return {};
    }

    const parsedMeals = JSON.parse(savedMeals);
    const convertedMeals = {};

    Object.entries(parsedMeals).forEach(([key, value]) => {
      if (value === true) {
        convertedMeals[key] = "taken";
      } else if (value === "taken" || value === "leave") {
        convertedMeals[key] = value;
      }
    });

    return convertedMeals;
  });

  // ==================================================
  // SUNDAY OFF
  // ==================================================

  const [sundayOffMeal, setSundayOffMeal] = useState(() => {
    return localStorage.getItem("sundayOffMeal") || "dinner";
  });

  // ==================================================
  // CURRENT MONTH
  // ==================================================

  const today = new Date();

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  // ==================================================
  // PERSONAL LEAVE
  // ==================================================

  const [leaveStart, setLeaveStart] = useState("");
  const [leaveEnd, setLeaveEnd] = useState("");

  // ==================================================
  // CLEAR INDIVIDUAL MEAL
  // ==================================================

  const [clearMealDate, setClearMealDate] = useState("");
  const [clearMealType, setClearMealType] = useState("lunch");

  // ==================================================
  // PAYMENT DATA
  // ==================================================

  const [monthlyFee, setMonthlyFee] = useState(() => {
    const savedFee = localStorage.getItem("monthlyMessFee");

    return savedFee ? Number(savedFee) : 3000;
  });

  const [payments, setPayments] = useState(() => {
    const savedPayments = localStorage.getItem("messPayments");

    return savedPayments ? JSON.parse(savedPayments) : {};
  });

  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [paymentNote, setPaymentNote] = useState("");

  // ==================================================
  // FIREBASE LOAD + SAVE
  // ==================================================

  useEffect(() => {
    if (!user) {
      return;
    }

    const loadFirebaseData = async () => {
      try {
        firebaseLoaded.current = false;

        // ---------------------------------------------
        // 1. Check data for current Google user
        // ---------------------------------------------

        const userDataRef = ref(database, `mealTrackerData/${user.uid}`);

        const userSnapshot = await get(userDataRef);

        if (userSnapshot.exists()) {
          const data = userSnapshot.val();

          if (data.meals) {
            setMeals(data.meals);
          }

          if (data.sundayOffMeal) {
            setSundayOffMeal(data.sundayOffMeal);
          }

          if (data.monthlyFee !== undefined) {
            setMonthlyFee(Number(data.monthlyFee));
          }

          if (data.payments) {
            setPayments(data.payments);
          }

          console.log("Google user data loaded successfully.");

          firebaseLoaded.current = true;
          return;
        }

        // ---------------------------------------------
        // 2. Completely new user
        // ---------------------------------------------

        setMeals({});
        setSundayOffMeal("dinner");
        setMonthlyFee(3000);
        setPayments({});

        console.log("No existing data found. New user account created.");

        firebaseLoaded.current = true;
      } catch (error) {
        console.error("Firebase load error:", error);

        firebaseLoaded.current = true;
      }
    };

    loadFirebaseData();
  }, [user]);

  // --------------------------------------------------
  // SAVE MEALS TO FIREBASE
  // --------------------------------------------------

  useEffect(() => {
    if (!firebaseLoaded.current || !user) {
      return;
    }

    const dataRef = ref(database, `mealTrackerData/${user.uid}/meals`);

    set(dataRef, meals).catch((error) => {
      console.error("Failed to save meals:", error);
    });

    // Local backup
    localStorage.setItem(`mealTracker_${user.uid}`, JSON.stringify(meals));
  }, [meals, user]);

  // --------------------------------------------------
  // SAVE SUNDAY SETTING
  // --------------------------------------------------

  useEffect(() => {
    if (!firebaseLoaded.current || !user) {
      return;
    }

    const dataRef = ref(database, `mealTrackerData/${user.uid}/sundayOffMeal`);

    set(dataRef, sundayOffMeal).catch((error) => {
      console.error("Failed to save Sunday setting:", error);
    });

    // Local backup
    localStorage.setItem(`sundayOffMeal_${user.uid}`, sundayOffMeal);
  }, [sundayOffMeal, user]);

  // --------------------------------------------------
  // SAVE MONTHLY FEE
  // --------------------------------------------------

  useEffect(() => {
    if (!firebaseLoaded.current || !user) {
      return;
    }

    const dataRef = ref(database, `mealTrackerData/${user.uid}/monthlyFee`);

    set(dataRef, monthlyFee).catch((error) => {
      console.error("Failed to save monthly fee:", error);
    });

    // Local backup
    localStorage.setItem(`monthlyMessFee_${user.uid}`, monthlyFee.toString());
  }, [monthlyFee, user]);

  // --------------------------------------------------
  // SAVE PAYMENTS
  // --------------------------------------------------

  useEffect(() => {
    if (!firebaseLoaded.current || !user) {
      return;
    }

    const dataRef = ref(database, `mealTrackerData/${user.uid}/payments`);

    set(dataRef, payments).catch((error) => {
      console.error("Failed to save payments:", error);
    });

    // Local backup
    localStorage.setItem(`messPayments_${user.uid}`, JSON.stringify(payments));
  }, [payments, user]);

  // ==================================================
  // MONTH INFORMATION
  // ==================================================

  const monthName = new Date(year, month).toLocaleString("default", {
    month: "long",
  });

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // 31 days = 62
  // 30 days = 60
  // 29 days = 58
  // 28 days = 56

  const monthlyAllowance = daysInMonth * 2;

  // ==================================================
  // TODAY
  // ==================================================

  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDate = today.getDate();

  // ==================================================
  // MEAL KEY
  // ==================================================

  const getMealKey = (selectedYear, selectedMonth, day, mealType) => {
    return `${selectedYear}-${selectedMonth + 1}-${day}-${mealType}`;
  };

  // ==================================================
  // CHECK SUNDAY
  // ==================================================

  const isSunday = (selectedYear, selectedMonth, day) => {
    const date = new Date(selectedYear, selectedMonth, day);

    return date.getDay() === 0;
  };

  // ==================================================
  // SUNDAY OFF
  // ==================================================

  const isSundayOff = (selectedYear, selectedMonth, day, mealType) => {
    return (
      sundayOffMeal !== "none" &&
      isSunday(selectedYear, selectedMonth, day) &&
      sundayOffMeal === mealType
    );
  };

  // ==================================================
  // GET MEAL STATUS
  // ==================================================

  const getMealStatus = (selectedYear, selectedMonth, day, mealType) => {
    if (isSundayOff(selectedYear, selectedMonth, day, mealType)) {
      return "off";
    }

    const key = getMealKey(selectedYear, selectedMonth, day, mealType);

    return meals[key] || "empty";
  };

  // ==================================================
  // TOGGLE MEAL
  // Empty → Taken → Leave → Empty
  // ==================================================

  const toggleMeal = (day, mealType) => {
    if (isSundayOff(year, month, day, mealType)) {
      return;
    }

    const key = getMealKey(year, month, day, mealType);

    setMeals((previous) => {
      const currentStatus = previous[key] || "empty";

      let nextStatus;

      if (currentStatus === "empty") {
        nextStatus = "taken";
      } else if (currentStatus === "taken") {
        nextStatus = "leave";
      } else {
        nextStatus = "empty";
      }

      const updated = {
        ...previous,
      };

      if (nextStatus === "empty") {
        delete updated[key];
      } else {
        updated[key] = nextStatus;
      }

      return updated;
    });
  };

  // ==================================================
  // MONTHLY MEAL COUNTS
  // ==================================================

  let takenMeals = 0;
  let personalLeaveMeals = 0;
  let sundayOffCount = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    if (isSundayOff(year, month, day, sundayOffMeal)) {
      sundayOffCount++;
    }

    const lunchStatus = getMealStatus(year, month, day, "lunch");

    const dinnerStatus = getMealStatus(year, month, day, "dinner");

    if (lunchStatus === "taken") {
      takenMeals++;
    }

    if (dinnerStatus === "taken") {
      takenMeals++;
    }

    if (lunchStatus === "leave") {
      personalLeaveMeals++;
    }

    if (dinnerStatus === "leave") {
      personalLeaveMeals++;
    }
  }

  const adjustedAllowance = monthlyAllowance - personalLeaveMeals;

  const remainingMeals = Math.max(adjustedAllowance - takenMeals, 0);

  // ==================================================
  // TODAY STATUS
  // ==================================================

  const isTodayVisible = year === todayYear && month === todayMonth;

  const todayLunchStatus = getMealStatus(
    todayYear,
    todayMonth,
    todayDate,
    "lunch",
  );

  const todayDinnerStatus = getMealStatus(
    todayYear,
    todayMonth,
    todayDate,
    "dinner",
  );

  // ==================================================
  // CHANGE MONTH
  // ==================================================

  const changeMonth = (direction) => {
    let newMonth = month + direction;
    let newYear = year;

    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }

    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }

    setMonth(newMonth);
    setYear(newYear);
  };

  // ==================================================
  // GO TO TODAY
  // ==================================================

  const goToToday = () => {
    setYear(todayYear);
    setMonth(todayMonth);
  };

  // ==================================================
  // APPLY LEAVE RANGE
  // ==================================================

  const applyLeaveRange = () => {
    if (!leaveStart || !leaveEnd) {
      alert("Please select start and end dates.");
      return;
    }

    const start = new Date(`${leaveStart}T00:00:00`);
    const end = new Date(`${leaveEnd}T00:00:00`);

    if (start > end) {
      alert("End date must be after start date.");
      return;
    }

    setMeals((previous) => {
      const updated = {
        ...previous,
      };

      const current = new Date(start);

      while (current <= end) {
        const selectedYear = current.getFullYear();
        const selectedMonth = current.getMonth();
        const day = current.getDate();

        if (selectedYear === year && selectedMonth === month) {
          if (!isSundayOff(selectedYear, selectedMonth, day, "lunch")) {
            const lunchKey = getMealKey(
              selectedYear,
              selectedMonth,
              day,
              "lunch",
            );

            updated[lunchKey] = "leave";
          }

          if (!isSundayOff(selectedYear, selectedMonth, day, "dinner")) {
            const dinnerKey = getMealKey(
              selectedYear,
              selectedMonth,
              day,
              "dinner",
            );

            updated[dinnerKey] = "leave";
          }
        }

        current.setDate(current.getDate() + 1);
      }

      return updated;
    });

    setLeaveStart("");
    setLeaveEnd("");
  };

  // ==================================================
  // CLEAR LEAVE RANGE
  // ==================================================

  const clearLeaveRange = () => {
    if (!leaveStart || !leaveEnd) {
      alert("Please select start and end dates.");
      return;
    }

    const start = new Date(`${leaveStart}T00:00:00`);
    const end = new Date(`${leaveEnd}T00:00:00`);

    if (start > end) {
      alert("End date must be after start date.");
      return;
    }

    setMeals((previous) => {
      const updated = {
        ...previous,
      };

      const current = new Date(start);

      while (current <= end) {
        const selectedYear = current.getFullYear();
        const selectedMonth = current.getMonth();
        const day = current.getDate();

        if (selectedYear === year && selectedMonth === month) {
          const lunchKey = getMealKey(
            selectedYear,
            selectedMonth,
            day,
            "lunch",
          );

          const dinnerKey = getMealKey(
            selectedYear,
            selectedMonth,
            day,
            "dinner",
          );

          if (updated[lunchKey] === "leave") {
            delete updated[lunchKey];
          }

          if (updated[dinnerKey] === "leave") {
            delete updated[dinnerKey];
          }
        }

        current.setDate(current.getDate() + 1);
      }

      return updated;
    });

    setLeaveStart("");
    setLeaveEnd("");
  };

  // ==================================================
  // CLEAR INDIVIDUAL MEAL
  // ==================================================

  const clearIndividualMeal = () => {
    if (!clearMealDate) {
      alert("Please select a date.");
      return;
    }

    const selectedDate = new Date(`${clearMealDate}T00:00:00`);

    const selectedYear = selectedDate.getFullYear();
    const selectedMonth = selectedDate.getMonth();
    const selectedDay = selectedDate.getDate();

    const key = getMealKey(
      selectedYear,
      selectedMonth,
      selectedDay,
      clearMealType,
    );

    if (meals[key] !== "leave") {
      alert(
        `No personal leave found for ${
          clearMealType === "lunch" ? "Lunch" : "Dinner"
        } on ${clearMealDate}.`,
      );

      return;
    }

    setMeals((previous) => {
      const updated = {
        ...previous,
      };

      delete updated[key];

      return updated;
    });

    setClearMealDate("");
  };

  // ==================================================
  // PAYMENT FUNCTIONS
  // ==================================================

  const getPaymentKey = (selectedYear, selectedMonth) => {
    return `${selectedYear}-${selectedMonth + 1}`;
  };

  const currentPaymentKey = getPaymentKey(year, month);

  const currentMonthPayments = payments[currentPaymentKey] || [];

  const totalPaid = currentMonthPayments.reduce(
    (total, payment) => total + Number(payment.amount),
    0,
  );

  const remainingAmount = Math.max(Number(monthlyFee) - totalPaid, 0);

  const paymentStatus =
    totalPaid >= Number(monthlyFee)
      ? "Fully Paid"
      : totalPaid > 0
        ? "Partially Paid"
        : "Not Paid";

  // ==================================================
  // ADD PAYMENT
  // ==================================================

  // ==================================================
  // ADD PAYMENT
  // ==================================================

  const addPayment = () => {
    const amount = Number(paymentAmount);

    if (!paymentAmount || amount <= 0) {
      alert("Please enter a valid payment amount.");
      return;
    }

    if (amount > remainingAmount) {
      alert(`Maximum remaining amount is ₹${remainingAmount}.`);
      return;
    }

    const selectedPaymentDate =
      paymentDate ||
      `${year}-${String(month + 1).padStart(2, "0")}-${String(
        todayDate,
      ).padStart(2, "0")}`;

    const existingPayments = payments[currentPaymentKey] || [];

    const paidBefore = existingPayments.reduce(
      (total, payment) => total + Number(payment.amount),
      0,
    );

    const paidAfter = paidBefore + amount;

    // --------------------------------------------------
    // AUTOMATIC PAYMENT TYPE
    // --------------------------------------------------

    let paymentType = "";

    // Direct full month payment
    if (paidBefore === 0 && amount >= Number(monthlyFee)) {
      paymentType = "Full Month Payment";
    }

    // First installment
    else if (paidBefore === 0) {
      paymentType = "1st Installment";
    }

    // Second installment completes the month
    else if (paidAfter >= Number(monthlyFee)) {
      paymentType = "2nd Installment";
    }

    // Any additional installment
    else {
      paymentType = `${existingPayments.length + 1}th Installment`;
    }

    const newPayment = {
      id: Date.now(),
      amount: amount,
      date: selectedPaymentDate,

      // Keep user's note if entered
      note: paymentNote.trim() || paymentType,

      // New automatic installment information
      paymentType: paymentType,
    };

    setPayments((previous) => ({
      ...previous,
      [currentPaymentKey]: [...(previous[currentPaymentKey] || []), newPayment],
    }));

    setPaymentAmount("");
    setPaymentDate("");
    setPaymentNote("");
  };

  // ==================================================
  // DELETE PAYMENT
  // ==================================================

  const deletePayment = (paymentId) => {
    const confirmed = window.confirm("Delete this payment?");

    if (!confirmed) {
      return;
    }

    setPayments((previous) => ({
      ...previous,
      [currentPaymentKey]: (previous[currentPaymentKey] || []).filter(
        (payment) => payment.id !== paymentId,
      ),
    }));
  };

  // ==================================================
  // YEARLY PAYMENT DATA
  // ==================================================

  const yearlyPaymentData = Array.from({ length: 12 }, (_, index) => {
    const monthKey = `${year}-${index + 1}`;

    const monthPayments = payments[monthKey] || [];

    const paid = monthPayments.reduce(
      (total, payment) => total + Number(payment.amount),
      0,
    );

    const remaining = Math.max(Number(monthlyFee) - paid, 0);

    let status = "Not Paid";

    if (paid >= Number(monthlyFee)) {
      status = "Fully Paid";
    } else if (paid > 0) {
      status = "Partially Paid";
    }

    return {
      month: index,
      monthName: new Date(year, index).toLocaleString("default", {
        month: "long",
      }),
      fee: Number(monthlyFee),
      paid,
      remaining,
      status,
    };
  });

  const yearlyTotalFee = yearlyPaymentData.reduce(
    (total, item) => total + item.fee,
    0,
  );

  const yearlyTotalPaid = yearlyPaymentData.reduce(
    (total, item) => total + item.paid,
    0,
  );

  const yearlyTotalRemaining = yearlyPaymentData.reduce(
    (total, item) => total + item.remaining,
    0,
  );

  const fullyPaidMonths = yearlyPaymentData.filter(
    (item) => item.status === "Fully Paid",
  ).length;

  const partiallyPaidMonths = yearlyPaymentData.filter(
    (item) => item.status === "Partially Paid",
  ).length;

  const unpaidMonths = yearlyPaymentData.filter(
    (item) => item.status === "Not Paid",
  ).length;

  // ==================================================
  // STATUS SYMBOL
  // ==================================================

  const getStatusSymbol = (status) => {
    if (status === "taken") {
      return "✓";
    }

    if (status === "leave") {
      return "🏖️";
    }

    if (status === "off") {
      return "OFF";
    }

    return "○";
  };

  // ==================================================
  // UI
  // ==================================================

  if (authLoading) {
    return (
      <div className="app auth-screen">
        <div className="auth-card">
          <h1>🍽️ Meal Tracker</h1>
          <p>Checking your login...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="app auth-screen">
        <div className="auth-card">
          <div className="auth-icon">🍽️</div>

          <h1>Meal Tracker</h1>

          <p className="auth-subtitle">Track your daily lunch and dinner</p>

          <p className="auth-description">
            Login to manage your meals, payments and monthly records.
          </p>

          <button className="google-login-button" onClick={handleGoogleLogin}>
            <span className="google-icon">G</span>
            <span>Continue with Google</span>
          </button>

          <p className="auth-note">
            🔒 Your data is securely linked to your Google account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {/* HEADER */}

      <header className="header">
        <h1>🍽️ Meal Tracker</h1>
        <p>Track your daily lunch and dinner</p>

        <div className="user-bar">
          <div className="user-info">
            <div className="user-avatar">
              {(user.displayName || user.email || "U").charAt(0).toUpperCase()}
            </div>

            <div className="user-details">
              <span className="user-name">{user.displayName || "User"}</span>
              <span className="user-email">{user.email}</span>
            </div>
          </div>

          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
          
        </div>
      </header>
      <main className="container">
        {/* TODAY'S STATUS */}

        {isTodayVisible && (
          <div className="today-section">
            <div className="today-title">
              <h2>📅 Today's Status</h2>

              <p>
                {todayDate} {monthName} {todayYear}
              </p>
            </div>

            <div className="today-meals">
              {/* LUNCH */}

              <div
                className={`today-meal ${
                  todayLunchStatus === "taken" ? "meal-done" : ""
                }`}
              >
                <div className="today-meal-icon">🍛</div>

                <div className="today-meal-info">
                  <h3>Lunch</h3>

                  <p>
                    {todayLunchStatus === "taken" && "✓ Taken"}

                    {todayLunchStatus === "leave" && "🏖️ Personal Leave"}

                    {todayLunchStatus === "off" && "🚫 Sunday OFF"}

                    {todayLunchStatus === "empty" && "○ Not Taken"}
                  </p>
                </div>
              </div>

              {/* DINNER */}

              <div
                className={`today-meal ${
                  todayDinnerStatus === "taken" ? "meal-done" : ""
                }`}
              >
                <div className="today-meal-icon">🍽️</div>

                <div className="today-meal-info">
                  <h3>Dinner</h3>

                  <p>
                    {todayDinnerStatus === "taken" && "✓ Taken"}

                    {todayDinnerStatus === "leave" && "🏖️ Personal Leave"}

                    {todayDinnerStatus === "off" && "🚫 Sunday OFF"}

                    {todayDinnerStatus === "empty" && "○ Not Taken"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MONTH NAVIGATION */}

        <div className="month-navigation">
          <button onClick={() => changeMonth(-1)}>←</button>

          <h2>
            {monthName} {year}
          </h2>

          <button onClick={() => changeMonth(1)}>→</button>
        </div>

        {/* ==================================================
            MONTHLY DASHBOARD
            ================================================== */}

        <div className="dashboard-card">
          <div className="dashboard-header">
            <div>
              <h2>
                📊 {monthName} {year} Dashboard
              </h2>
              <p>Your complete monthly mess overview</p>
            </div>
          </div>

          {/* DASHBOARD STATS */}

          <div className="dashboard-stats">
            <div className="dashboard-stat">
              <span>🍛</span>
              <p>Meals Taken</p>
              <strong>{takenMeals}</strong>
            </div>

            <div className="dashboard-stat">
              <span>🏖️</span>
              <p>Leave Meals</p>
              <strong>{personalLeaveMeals}</strong>
            </div>

            <div className="dashboard-stat">
              <span>⏳</span>
              <p>Meals Remaining</p>
              <strong>{remainingMeals}</strong>
            </div>

            <div className="dashboard-stat">
              <span>💰</span>
              <p>Paid</p>
              <strong>₹{totalPaid.toLocaleString("en-IN")}</strong>
            </div>

            <div className="dashboard-stat">
              <span>💳</span>
              <p>Payment Remaining</p>
              <strong>₹{remainingAmount.toLocaleString("en-IN")}</strong>
            </div>

            <div className="dashboard-stat">
              <span>
                {paymentStatus === "Fully Paid"
                  ? "🟢"
                  : paymentStatus === "Partially Paid"
                    ? "🟡"
                    : "🔴"}
              </span>

              <p>Payment Status</p>

              <strong className="dashboard-status-text">{paymentStatus}</strong>
            </div>
          </div>

          {/* MEAL PROGRESS */}

          <div className="dashboard-progress-section">
            <div className="dashboard-progress-header">
              <strong>🍽️ Meal Progress</strong>

              <span>
                {takenMeals} / {adjustedAllowance}
              </span>
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill meal-progress"
                style={{
                  width:
                    adjustedAllowance > 0
                      ? `${Math.min(
                          (takenMeals / adjustedAllowance) * 100,
                          100,
                        )}%`
                      : "0%",
                }}
              ></div>
            </div>

            <p className="progress-text">
              {takenMeals} meals taken out of {adjustedAllowance} available
              meals
            </p>
          </div>

          {/* PAYMENT PROGRESS */}

          <div className="dashboard-progress-section">
            <div className="dashboard-progress-header">
              <strong>💰 Payment Progress</strong>

              <span>
                ₹{totalPaid.toLocaleString("en-IN")} / ₹
                {Number(monthlyFee).toLocaleString("en-IN")}
              </span>
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill payment-progress"
                style={{
                  width:
                    Number(monthlyFee) > 0
                      ? `${Math.min(
                          (totalPaid / Number(monthlyFee)) * 100,
                          100,
                        )}%`
                      : "0%",
                }}
              ></div>
            </div>

            <p className="progress-text">
              ₹{totalPaid.toLocaleString("en-IN")} paid out of ₹
              {Number(monthlyFee).toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        {/* GO TO TODAY */}

        {!isTodayVisible && (
          <div className="today-button-container">
            <button className="go-today-button" onClick={goToToday}>
              📅 Go to Today
            </button>
          </div>
        )}

        {/* SUNDAY SETTING */}

        <div className="settings-card">
          <div>
            <h3>🚫 Sunday Weekly OFF</h3>

            <p>Choose which one meal is OFF every Sunday.</p>
          </div>

          <select
            value={sundayOffMeal}
            onChange={(event) => setSundayOffMeal(event.target.value)}
          >
            <option value="lunch">🍛 Lunch OFF</option>

            <option value="dinner">🍽️ Dinner OFF</option>

            <option value="none">No Sunday OFF</option>
          </select>
        </div>

        {/* PERSONAL LEAVE */}

        <div className="leave-card">
          <div className="leave-header">
            <div>
              <h3>🏖️ Personal Leave</h3>

              <p>Take leave for one day or multiple days.</p>
            </div>
          </div>

          <div className="leave-controls">
            <div>
              <label>Start Date</label>

              <input
                type="date"
                value={leaveStart}
                onChange={(event) => setLeaveStart(event.target.value)}
              />
            </div>

            <div>
              <label>End Date</label>

              <input
                type="date"
                value={leaveEnd}
                onChange={(event) => setLeaveEnd(event.target.value)}
              />
            </div>

            <button className="apply-leave" onClick={applyLeaveRange}>
              🏖️ Apply Leave
            </button>

            <button className="clear-leave" onClick={clearLeaveRange}>
              Clear Leave
            </button>
          </div>

          <p className="leave-help">
            Example: Start = 10 March, End = 17 March → 8 days leave. Sunday OFF
            is automatically excluded from personal leave calculation.
          </p>
        </div>

        {/* CLEAR INDIVIDUAL MEAL */}

        <div className="clear-meal-card">
          <div className="clear-meal-header">
            <h3>🧹 Clear Individual Meal</h3>

            <p>Clear only one Lunch or Dinner leave.</p>
          </div>

          <div className="clear-meal-controls">
            <div>
              <label>Select Date</label>

              <input
                type="date"
                value={clearMealDate}
                onChange={(event) => setClearMealDate(event.target.value)}
              />
            </div>

            <div>
              <label>Select Meal</label>

              <select
                value={clearMealType}
                onChange={(event) => setClearMealType(event.target.value)}
              >
                <option value="lunch">🍛 Lunch</option>

                <option value="dinner">🍽️ Dinner</option>
              </select>
            </div>

            <button
              className="clear-individual-button"
              onClick={clearIndividualMeal}
            >
              🧹 Clear Meal
            </button>
          </div>

          <p className="clear-meal-help">
            Select a date and meal to clear only that individual personal leave.
          </p>
        </div>

        {/* ==================================================
            MONTHLY PAYMENT
            ================================================== */}

        <div className="payment-card">
          <div className="payment-header">
            <div>
              <h2>💰 Monthly Payment</h2>

              <p>
                Manage your mess payment for{" "}
                <strong>
                  {monthName} {year}
                </strong>
              </p>
            </div>

            <div
              className={`payment-status ${
                paymentStatus === "Fully Paid"
                  ? "paid"
                  : paymentStatus === "Partially Paid"
                    ? "partial"
                    : "not-paid"
              }`}
            >
              {paymentStatus === "Fully Paid" && "🟢 Fully Paid"}

              {paymentStatus === "Partially Paid" && "🟡 Partially Paid"}

              {paymentStatus === "Not Paid" && "🔴 Not Paid"}
            </div>
          </div>

          {/* PAYMENT SUMMARY */}

          <div className="payment-summary">
            <div>
              <span>Monthly Fee</span>

              <strong>₹{Number(monthlyFee).toLocaleString("en-IN")}</strong>
            </div>

            <div>
              <span>Total Paid</span>

              <strong>₹{totalPaid.toLocaleString("en-IN")}</strong>
            </div>

            <div>
              <span>Remaining</span>

              <strong>₹{remainingAmount.toLocaleString("en-IN")}</strong>
            </div>
          </div>

          {/* MONTHLY FEE */}

          <div className="fee-setting">
            <label>Monthly Mess Fee</label>

            <div className="fee-input-row">
              <span>₹</span>

              <input
                type="number"
                min="0"
                value={monthlyFee}
                onChange={(event) => setMonthlyFee(Number(event.target.value))}
              />
            </div>
          </div>

          {/* ADD PAYMENT */}

          {remainingAmount > 0 && (
            <div className="add-payment-section">
              <h3>➕ Add Payment</h3>

              <div className="payment-form">
                <div>
                  <label>Amount</label>

                  <input
                    type="number"
                    min="1"
                    max={remainingAmount}
                    placeholder="₹1500"
                    value={paymentAmount}
                    onChange={(event) => setPaymentAmount(event.target.value)}
                  />
                </div>

                <div>
                  <label>Payment Date</label>

                  <input
                    type="date"
                    value={paymentDate}
                    onChange={(event) => setPaymentDate(event.target.value)}
                  />
                </div>

                <div>
                  <label>Note</label>

                  <input
                    type="text"
                    placeholder="First installment"
                    value={paymentNote}
                    onChange={(event) => setPaymentNote(event.target.value)}
                  />
                </div>

                <button className="add-payment-button" onClick={addPayment}>
                  💰 Save Payment
                </button>
              </div>
            </div>
          )}

          {/* PAYMENT HISTORY */}

          <div className="payment-history">
            <h3>📜 Payment History</h3>

            {currentMonthPayments.length === 0 ? (
              <div className="no-payment">
                No payment recorded for this month.
              </div>
            ) : (
              <div className="payment-list">
                {currentMonthPayments
                  .slice()
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((payment) => (
                    <div className="payment-history-item" key={payment.id}>
                      <div className="payment-history-date">
                        📅 {payment.date}
                      </div>

                      <div className="payment-history-note">
                        <strong>{payment.paymentType || payment.note}</strong>

                        {payment.paymentType &&
                          payment.note !== payment.paymentType && (
                            <small>{payment.note}</small>
                          )}
                      </div>

                      <strong className="payment-history-amount">
                        ₹{Number(payment.amount).toLocaleString("en-IN")}
                      </strong>

                      <button
                        className="delete-payment"
                        onClick={() => deletePayment(payment.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* ==================================================
            YEARLY PAYMENT HISTORY
            ================================================== */}

        <div className="yearly-history-card">
          <div className="yearly-history-header">
            <div>
              <h2>📊 {year} Yearly Payment History</h2>

              <p>Complete mess payment summary for the year.</p>
            </div>
          </div>

          {/* YEARLY SUMMARY */}

          <div className="yearly-summary">
            <div className="yearly-summary-card">
              <span>💰</span>

              <p>Total Annual Fee</p>

              <strong>₹{yearlyTotalFee.toLocaleString("en-IN")}</strong>
            </div>

            <div className="yearly-summary-card">
              <span>✅</span>

              <p>Total Paid</p>

              <strong>₹{yearlyTotalPaid.toLocaleString("en-IN")}</strong>
            </div>

            <div className="yearly-summary-card">
              <span>⏳</span>

              <p>Total Remaining</p>

              <strong>₹{yearlyTotalRemaining.toLocaleString("en-IN")}</strong>
            </div>

            <div className="yearly-summary-card">
              <span>🟢</span>

              <p>Fully Paid Months</p>

              <strong>{fullyPaidMonths}</strong>
            </div>

            <div className="yearly-summary-card">
              <span>🟡</span>

              <p>Partial Months</p>

              <strong>{partiallyPaidMonths}</strong>
            </div>

            <div className="yearly-summary-card">
              <span>🔴</span>

              <p>Unpaid Months</p>

              <strong>{unpaidMonths}</strong>
            </div>
          </div>

          {/* YEARLY MONTHLY TABLE */}

          <div className="yearly-table-container">
            <table>
              <thead>
                <tr>
                  <th>Month</th>

                  <th>Mess Fee</th>

                  <th>Paid</th>

                  <th>Remaining</th>

                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {yearlyPaymentData.map((item) => (
                  <tr key={item.month}>
                    <td>
                      <strong>{item.monthName}</strong>
                    </td>

                    <td>₹{item.fee.toLocaleString("en-IN")}</td>

                    <td className="yearly-paid">
                      ₹{item.paid.toLocaleString("en-IN")}
                    </td>

                    <td className="yearly-remaining">
                      ₹{item.remaining.toLocaleString("en-IN")}
                    </td>

                    <td>
                      <span
                        className={`yearly-status ${
                          item.status === "Fully Paid"
                            ? "yearly-paid-status"
                            : item.status === "Partially Paid"
                              ? "yearly-partial-status"
                              : "yearly-unpaid-status"
                        }`}
                      >
                        {item.status === "Fully Paid" && "🟢 Fully Paid"}

                        {item.status === "Partially Paid" && "🟡 Partial"}

                        {item.status === "Not Paid" && "🔴 Not Paid"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ==================================================
            MEAL SUMMARY
            ================================================== */}

        <div className="summary">
          <div className="summary-card">
            <span>📅</span>

            <p>Calendar Days</p>

            <strong>{daysInMonth}</strong>
          </div>

          <div className="summary-card">
            <span>🍽️</span>

            <p>Monthly Allowance</p>

            <strong>{monthlyAllowance}</strong>
          </div>

          <div className="summary-card">
            <span>🏖️</span>

            <p>Leave Meals</p>

            <strong>{personalLeaveMeals}</strong>
          </div>

          <div className="summary-card">
            <span>🎯</span>

            <p>Adjusted Allowance</p>

            <strong>{adjustedAllowance}</strong>
          </div>

          <div className="summary-card">
            <span>✅</span>

            <p>Meals Taken</p>

            <strong>{takenMeals}</strong>
          </div>

          <div className="summary-card total">
            <span>⏳</span>

            <p>Remaining</p>

            <strong>{remainingMeals}</strong>
          </div>
        </div>

        {/* SUNDAY INFO */}

        <div className="info-box">
          <span>🚫</span>

          <p>
            Sundays with{" "}
            <strong>
              {sundayOffMeal === "lunch"
                ? "Lunch"
                : sundayOffMeal === "dinner"
                  ? "Dinner"
                  : "no meal"}
            </strong>{" "}
            OFF are not deducted from your monthly allowance.
          </p>

          <strong>
            Sunday OFF: {sundayOffMeal === "none" ? 0 : sundayOffCount}
          </strong>
        </div>

        {/* MEAL TABLE */}

        <div className="meal-table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>

                <th>Day</th>

                <th>🍛 Lunch</th>

                <th>🍽️ Dinner</th>
              </tr>
            </thead>

            <tbody>
              {Array.from(
                {
                  length: daysInMonth,
                },
                (_, index) => {
                  const day = index + 1;

                  const date = new Date(year, month, day);

                  const dayName = date.toLocaleString("default", {
                    weekday: "short",
                  });

                  const isToday =
                    year === todayYear &&
                    month === todayMonth &&
                    day === todayDate;

                  const lunchStatus = getMealStatus(year, month, day, "lunch");

                  const dinnerStatus = getMealStatus(
                    year,
                    month,
                    day,
                    "dinner",
                  );

                  return (
                    <tr key={day} className={isToday ? "today-row" : ""}>
                      {/* DATE */}

                      <td>
                        {day}

                        {isToday && <span className="today-label">TODAY</span>}
                      </td>

                      {/* DAY */}

                      <td>{dayName}</td>

                      {/* LUNCH */}

                      <td>
                        <button
                          disabled={lunchStatus === "off"}
                          className={`meal-button ${
                            lunchStatus === "taken" ? "taken" : ""
                          } ${lunchStatus === "leave" ? "leave" : ""} ${
                            lunchStatus === "off" ? "off" : ""
                          }`}
                          onClick={() => toggleMeal(day, "lunch")}
                        >
                          {getStatusSymbol(lunchStatus)}
                        </button>
                      </td>

                      {/* DINNER */}

                      <td>
                        <button
                          disabled={dinnerStatus === "off"}
                          className={`meal-button ${
                            dinnerStatus === "taken" ? "taken" : ""
                          } ${dinnerStatus === "leave" ? "leave" : ""} ${
                            dinnerStatus === "off" ? "off" : ""
                          }`}
                          onClick={() => toggleMeal(day, "dinner")}
                        >
                          {getStatusSymbol(dinnerStatus)}
                        </button>
                      </td>
                    </tr>
                  );
                },
              )}
            </tbody>
          </table>
        </div>

        {/* LEGEND */}

        <div className="legend">
          <div>
            <span className="legend-circle taken">✓</span>
            Taken
          </div>

          <div>
            <span className="legend-circle leave">🏖️</span>
            Personal Leave
          </div>

          <div>
            <span className="legend-circle off">OFF</span>
            Sunday OFF
          </div>

          <div>
            <span className="legend-circle empty">○</span>
            Not Marked
          </div>
        </div>

        {/* INSTRUCTION */}

        <div className="instruction-box">
          <strong>💡 Meal Button:</strong>

          <span>
            Click once = Taken → Click again = Personal Leave → Click again =
            Clear
          </span>
        </div>
      </main>
    </div>
  );
}

export default App;
