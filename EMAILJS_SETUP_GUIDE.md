# EmailJS Setup Guide for VAL Contact Form

This guide will walk you through setting up EmailJS to enable the contact form to send emails directly from the website.

## Step 1: Create an EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click **"Sign Up"** (it's free!)
3. Create an account using your email or Google account
4. Verify your email address

## Step 2: Add an Email Service

1. Once logged in, go to the **"Email Services"** tab in the dashboard
2. Click **"Add New Service"**
3. Select **"Gmail"** (recommended) or another email provider
4. Click **"Connect Account"**
5. Sign in with your **vallearningco@gmail.com** account
6. Grant EmailJS permission to send emails on your behalf
7. Give your service a name (e.g., "VAL Contact Form")
8. Click **"Create Service"**
9. **IMPORTANT:** Copy your **Service ID** (you'll need this later)

## Step 3: Create an Email Template

1. Go to the **"Email Templates"** tab
2. Click **"Create New Template"**
3. Replace the default template with this:

### Template Content:

**Subject:**
```
New Contact Form Submission: {{subject}}
```

**Body:**
```
You have received a new message from the VAL website contact form.

From: {{name}}
Email: {{email}}
Subject: {{subject}}

Message:
{{message}}

---
This message was sent via the VAL website contact form.
Reply directly to this email to respond to {{name}}.
```

4. **Template Settings:**
   - Set "From Name" to: `VAL Contact Form`
   - Set "From Email" to: `your-emailjs-email@emailjs.com` (auto-filled)
   - Set "To Email" to: `vallearningco@gmail.com`
   - Set "Reply To" to: `{{email}}` (this allows you to reply directly to the sender)

5. Click **"Save"**
6. **IMPORTANT:** Copy your **Template ID** (you'll need this later)

## Step 4: Get Your Public Key

1. Go to **"Account"** → **"General"** in the EmailJS dashboard
2. Find your **Public Key** (also called API Key)
3. **IMPORTANT:** Copy your **Public Key** (you'll need this later)

## Step 5: Update the Contact Form Code

1. Open `src/pages/Contact.jsx`
2. Find lines 46-48 where it says:
   ```javascript
   const result = await emailjs.sendForm(
     'YOUR_SERVICE_ID',        // Replace with your EmailJS service ID
     'YOUR_TEMPLATE_ID',       // Replace with your EmailJS template ID
     form.current,
     'YOUR_PUBLIC_KEY'         // Replace with your EmailJS public key
   )
   ```

3. Replace the placeholders with your actual credentials:
   ```javascript
   const result = await emailjs.sendForm(
     'service_abc1234',        // Your Service ID from Step 2
     'template_xyz5678',       // Your Template ID from Step 3
     form.current,
     'your_public_key_here'    // Your Public Key from Step 4
   )
   ```

## Step 6: Test the Contact Form

1. Save the file
2. The development server should auto-reload
3. Go to the Contact page
4. Fill out the form with test data
5. Click "Send Message"
6. You should see a success message
7. Check your **vallearningco@gmail.com** inbox for the test email

## Optional: Set Up Auto-Reply to Users

If you want to automatically send a confirmation email to users when they submit the form:

1. Create a **second email template** in EmailJS
2. Use this template content:

**Subject:**
```
Thank you for contacting VAL!
```

**Body:**
```
Hi {{name}},

Thank you for reaching out to VAL (Value Added Learning)! We've received your message and will get back to you within 24-48 hours.

Your message:
Subject: {{subject}}
Message: {{message}}

If you have any urgent questions, feel free to email us directly at vallearningco@gmail.com.

Best regards,
The VAL Team
Stress Less, Start Strong
```

3. In `Contact.jsx`, add a second `emailjs.send()` call after the first one succeeds
4. This second call will send the auto-reply to the user's email address

## Troubleshooting

### Email not sending?
- Check that all three credentials (Service ID, Template ID, Public Key) are correct
- Make sure you're connected to the internet
- Check the browser console for error messages
- Verify your EmailJS account is active and not over the free tier limit (200 emails/month)

### Getting CORS errors?
- Make sure you're using the correct Public Key (not the Private Key)
- EmailJS should work from localhost without issues

### Emails going to spam?
- This is normal for the first few emails
- Ask recipients to mark your emails as "Not Spam"
- Consider upgrading to a paid EmailJS plan for better deliverability

## Free Tier Limits

EmailJS free tier includes:
- **200 emails per month**
- **2 email templates**
- **1 email service**

This should be more than enough for the VAL website. If you exceed this, consider upgrading to a paid plan ($7/month for 1,000 emails).

---

**Need help?** Contact EmailJS support at [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)

