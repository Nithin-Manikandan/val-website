# VAL Authentication & Session Management System

## 🎉 What's Been Built

A complete, production-ready authentication and session management system for VAL with:

### ✅ **Authentication Features**
- Email/password signup and login
- Secure password storage (handled by Supabase)
- Persistent user sessions
- Role-based access control (user vs admin)
- Protected routes

### ✅ **User Dashboard**
- Personalized welcome with user's name
- Session statistics (booked, attended, amount owed)
- Browse and book upcoming sessions
- View payment history
- Real-time data updates

### ✅ **Admin Dashboard**
- Session management (create, edit, delete sessions)
- Automatic pricing based on session type:
  - Group: $15/30min
  - 1-on-1: $25/30min
  - Extended: $50/1hr
- User management (view all registered users)
- Attendance tracking (mark who attended)
- Automatic payment record creation when marking attendance

### ✅ **Database Schema**
- **Profiles:** User accounts with roles
- **Sessions:** Weekly sessions with details and pricing
- **Bookings:** User session registrations with attendance status
- **Payments:** Attendance-based billing records

---

## 🚀 Quick Start Guide

### **Step 1: Set Up Supabase (5-10 minutes)**

Follow the detailed guide in `SUPABASE_SETUP_GUIDE.md`:

1. Create a Supabase account and project
2. Copy your Project URL and API key
3. Run the SQL schema to create tables
4. Set up Row Level Security policies
5. Create the auto-profile trigger

### **Step 2: Configure Environment Variables**

1. Create a `.env` file in your project root:
```bash
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...your-key-here
```

2. Replace the values with your actual Supabase credentials

### **Step 3: Start the Development Server**

```bash
npm run dev
```

Your app will be running at `http://localhost:5173`

---

## 📁 New Files Created

### **Configuration**
- `src/config/supabaseClient.js` - Supabase client setup
- `.env.example` - Environment variables template

### **Authentication**
- `src/context/AuthContext.jsx` - Global auth state management
- `src/pages/Login.jsx` - Login page
- `src/pages/Signup.jsx` - Signup page
- `src/pages/Auth.css` - Auth pages styling
- `src/components/ProtectedRoute.jsx` - Route protection

### **Dashboards**
- `src/pages/Dashboard.jsx` - User dashboard
- `src/pages/Dashboard.css` - User dashboard styling
- `src/pages/AdminDashboard.jsx` - Admin dashboard
- `src/pages/AdminDashboard.css` - Admin dashboard styling

### **Documentation**
- `SUPABASE_SETUP_GUIDE.md` - Complete Supabase setup instructions
- `AUTH_SYSTEM_README.md` - This file

### **Modified Files**
- `src/App.jsx` - Added auth routes and AuthProvider
- `src/components/Navigation.jsx` - Added auth-aware navigation
- `src/App.css` - Added loading spinner styles

---

## 🔐 User Roles

### **Regular User**
- Can sign up and log in
- Can view and book sessions
- Can see their own bookings and payments
- Access to `/dashboard`

### **Admin (Founders)**
- All user permissions
- Can create/edit/delete sessions
- Can view all users and bookings
- Can mark attendance
- Can generate payments
- Access to `/admin`

**To make a user an admin:**
```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'founder@example.com';
```

---

## 🎯 How to Use

### **For Users:**
1. Go to `/signup` to create an account
2. Log in at `/login`
3. Browse sessions on the dashboard
4. Click "Book Session" to register
5. View payment history

### **For Admins:**
1. Log in with admin account
2. Click "Admin" in navigation
3. **Sessions Tab:** Create/edit weekly sessions
4. **Users Tab:** View all registered users
5. **Bookings Tab:** Mark attendance and track payments

---

## 💡 Key Features Explained

### **Attendance-Based Billing**
- Users are only charged for sessions they **actually attend**
- When admin marks attendance as "attended", a payment record is automatically created
- Payment status tracks "pending" vs "paid"

### **Real-Time Updates**
- All data fetches from Supabase in real-time
- Changes made by admins are immediately visible to users
- Session bookings update live

### **Security**
- Row Level Security (RLS) ensures users can only see their own data
- Admins have elevated permissions
- Passwords are securely hashed by Supabase
- Protected routes prevent unauthorized access

---

## 🧪 Testing Checklist

- [ ] Sign up a new user
- [ ] Log in with email/password
- [ ] View user dashboard
- [ ] Book a session
- [ ] Make first user an admin (SQL query)
- [ ] Access admin dashboard
- [ ] Create a new session
- [ ] Edit a session
- [ ] Mark attendance as "attended"
- [ ] Verify payment record was created
- [ ] Check user dashboard shows payment

---

## 🎨 Design Integration

The authentication system seamlessly integrates with VAL's existing design:
- Uses VAL's color scheme (cyan/turquoise gradient)
- Matches existing button and card styles
- Responsive design for mobile
- Professional, clean UI

---

## 📊 Database Structure

```
auth.users (Supabase managed)
  └─> profiles (your table)
        ├─> bookings
        │     └─> sessions
        └─> payments
              └─> sessions
```

---

## 🔧 Troubleshooting

**"Supabase client not configured" error:**
- Make sure `.env` file exists with correct credentials
- Restart dev server after creating `.env`

**"Row-level security policy violation":**
- Make sure you ran all RLS policies from setup guide
- Check that user has correct role in database

**Profile not created on signup:**
- Check that trigger function was created
- Look for errors in Supabase logs

---

## 🚀 Next Steps

1. **Set up Supabase** using the guide
2. **Create your `.env` file** with credentials
3. **Test the authentication flow**
4. **Make yourself an admin**
5. **Create some test sessions**
6. **Invite users to sign up!**

---

## 📞 Support

If you encounter any issues:
1. Check the `SUPABASE_SETUP_GUIDE.md` for detailed setup instructions
2. Review the Supabase dashboard for error logs
3. Check browser console for client-side errors
4. Verify all SQL queries were executed successfully

---

**Built with ❤️ for VAL - Helping freshmen stress less and start strong!**

