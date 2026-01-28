# ✅ VAL Authentication System - Quick Start Checklist

Follow these steps in order to get your authentication system up and running!

---

## 📋 Setup Checklist

### **1. Create Supabase Project** ⏱️ 3 minutes

- [ ] Go to https://supabase.com/ and sign up
- [ ] Click "New Project"
- [ ] Name it "VAL Authentication"
- [ ] Set a strong database password (save it!)
- [ ] Choose your region
- [ ] Click "Create new project"
- [ ] Wait 2-3 minutes for provisioning

---

### **2. Get Supabase Credentials** ⏱️ 1 minute

- [ ] Go to Settings → API in Supabase dashboard
- [ ] Copy your **Project URL** (looks like `https://xxxxx.supabase.co`)
- [ ] Copy your **anon public** key (long string starting with `eyJ...`)
- [ ] Keep these handy for the next step

---

### **3. Create Database Tables** ⏱️ 2 minutes

- [ ] In Supabase, click "SQL Editor" in sidebar
- [ ] Click "New query"
- [ ] Open `SUPABASE_SETUP_GUIDE.md` in your project
- [ ] Copy the SQL from **Step 3** (Create Database Tables)
- [ ] Paste into Supabase SQL Editor
- [ ] Click "Run"
- [ ] Verify you see "Success. No rows returned"

---

### **4. Set Up Row Level Security** ⏱️ 1 minute

- [ ] In Supabase SQL Editor, click "New query"
- [ ] Copy the SQL from **Step 4** in the setup guide (RLS policies)
- [ ] Paste and click "Run"
- [ ] Verify success

---

### **5. Create Auto-Profile Trigger** ⏱️ 1 minute

- [ ] In Supabase SQL Editor, click "New query"
- [ ] Copy the SQL from **Step 5** in the setup guide (trigger function)
- [ ] Paste and click "Run"
- [ ] Verify success

---

### **6. Configure Environment Variables** ⏱️ 1 minute

- [ ] In your VAL project root, create a file named `.env`
- [ ] Add these two lines:
  ```
  VITE_SUPABASE_URL=your_project_url_here
  VITE_SUPABASE_ANON_KEY=your_anon_key_here
  ```
- [ ] Replace with your actual Supabase credentials from Step 2
- [ ] Save the file

---

### **7. Restart Development Server** ⏱️ 30 seconds

- [ ] Stop the current dev server (Ctrl+C in terminal)
- [ ] Run `npm run dev` again
- [ ] Server should start without errors

---

### **8. Test User Signup** ⏱️ 2 minutes

- [ ] Open http://localhost:5174/signup in your browser
- [ ] Fill out the signup form:
  - Full Name: Your name
  - Email: Your email
  - Password: At least 6 characters
  - Confirm Password: Same password
- [ ] Click "Sign Up"
- [ ] You should see "Account Created!" message
- [ ] Wait 2 seconds for auto-redirect to login

---

### **9. Test User Login** ⏱️ 1 minute

- [ ] Go to http://localhost:5174/login
- [ ] Enter your email and password
- [ ] Click "Sign In"
- [ ] You should be redirected to the dashboard
- [ ] Verify you see your name in the welcome message

---

### **10. Make Yourself an Admin** ⏱️ 1 minute

- [ ] In Supabase, go to SQL Editor
- [ ] Run this query (replace with your email):
  ```sql
  UPDATE profiles 
  SET role = 'admin' 
  WHERE email = 'your-email@example.com';
  ```
- [ ] Refresh your dashboard
- [ ] You should now see an "Admin" button in navigation

---

### **11. Test Admin Dashboard** ⏱️ 2 minutes

- [ ] Click "Admin" in the navigation
- [ ] You should see the admin dashboard with 3 tabs
- [ ] Click "+ Add New Session"
- [ ] Fill out the form:
  - Title: "Test Session"
  - Description: "This is a test"
  - Date: Tomorrow's date
  - Time: 3:00 PM
  - Type: Group
  - Price: $15 (auto-filled)
  - Capacity: 10
- [ ] Click "Create Session"
- [ ] Verify the session appears in the list

---

### **12. Test Session Booking** ⏱️ 1 minute

- [ ] Click "Dashboard" in navigation (back to user view)
- [ ] You should see your test session in "Upcoming Sessions"
- [ ] Click "Book Session"
- [ ] You should see "Session booked successfully!"
- [ ] Button should change to "✓ Booked"

---

### **13. Test Attendance Tracking** ⏱️ 1 minute

- [ ] Go back to Admin dashboard
- [ ] Click "Bookings & Attendance" tab
- [ ] Find your booking in the table
- [ ] Change status dropdown from "booked" to "attended"
- [ ] This should create a payment record automatically

---

### **14. Verify Payment Created** ⏱️ 1 minute

- [ ] Go back to user Dashboard
- [ ] Scroll to "Payment History" section
- [ ] You should see a payment record for $15
- [ ] Status should be "pending"
- [ ] "Amount Owed" stat should show $15

---

## 🎉 Success!

If all checkboxes are checked, your authentication system is fully functional!

---

## 📊 What You've Built

✅ Complete user authentication system  
✅ Role-based access control  
✅ User dashboard with session booking  
✅ Admin dashboard with session management  
✅ Attendance tracking  
✅ Automatic payment generation  
✅ Real-time data synchronization  

---

## 🚀 Next Steps

1. **Invite your co-founders** to sign up and make them admins
2. **Create real sessions** for your students
3. **Customize the session types** and pricing if needed
4. **Add more features** as your program grows!

---

## ❓ Troubleshooting

**Issue:** "Supabase client not configured" error
**Fix:** Make sure `.env` file exists and server was restarted

**Issue:** Can't see Admin button
**Fix:** Make sure you ran the SQL to update your role to 'admin'

**Issue:** Sessions not showing up
**Fix:** Check that session date is today or in the future

**Issue:** Can't log in after signup
**Fix:** Make sure you used the same email/password you signed up with

---

**Need help?** Review the detailed `SUPABASE_SETUP_GUIDE.md` or `AUTH_SYSTEM_README.md`

**Ready to launch?** Your VAL authentication system is production-ready! 🎓✨

