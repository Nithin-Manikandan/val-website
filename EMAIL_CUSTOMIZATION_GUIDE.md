# VAL Email Template Customization Guide

## 🎯 Problem
The default Supabase confirmation emails are bland and don't mention VAL. Let's customize them!

---

## 📧 Step 1: Customize Confirmation Email Template

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your VAL project
3. Click **"Authentication"** in the left sidebar
4. Click **"Email Templates"** tab
5. Select **"Confirm signup"** from the dropdown

### Replace the default template with this VAL-branded version:

```html
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">

  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #00f5d4; margin: 0; font-size: 32px;">VAL</h1>
    <p style="color: #666; margin: 5px 0; font-size: 14px;">Value Added Learning</p>
  </div>

  <div style="background: #ffffff; border-radius: 12px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">

    <h2 style="color: #1a1a1a; margin-top: 0;">Welcome to VAL! 🎉</h2>

    <p style="color: #333; line-height: 1.6; font-size: 16px;">
      Thank you for joining <strong>VAL (Value Added Learning)</strong> - your peer-to-peer guidance and mentorship service for high school freshmen!
    </p>

    <p style="color: #333; line-height: 1.6; font-size: 16px;">
      We're excited to help you <strong>stress less and start strong</strong> in your high school journey.
    </p>

    <p style="color: #333; line-height: 1.6; font-size: 16px;">
      To complete your registration and access your dashboard, please confirm your email address:
    </p>

    <div style="text-align: center; margin: 35px 0;">
      <a href="{{ .ConfirmationURL }}"
         style="background: linear-gradient(135deg, #00f5d4 0%, #00d4aa 100%);
                color: #1a1a1a;
                padding: 16px 40px;
                text-decoration: none;
                border-radius: 10px;
                font-weight: 600;
                font-size: 16px;
                display: inline-block;
                box-shadow: 0 4px 12px rgba(0, 245, 212, 0.3);">
        ✅ Confirm Your Email
      </a>
    </div>

    <div style="background: #f8f9fa; border-left: 4px solid #00f5d4; padding: 15px; margin: 25px 0; border-radius: 4px;">
      <p style="margin: 0; color: #666; font-size: 14px;">
        <strong>Can't click the button?</strong> Copy and paste this link into your browser:
      </p>
      <p style="margin: 10px 0 0 0; word-break: break-all; color: #00d4aa; font-size: 13px;">
        {{ .ConfirmationURL }}
      </p>
    </div>

    <hr style="margin: 30px 0; border: none; border-top: 1px solid #e0e0e0;">

    <h3 style="color: #1a1a1a; font-size: 18px;">What's Next?</h3>
    <ul style="color: #333; line-height: 1.8; padding-left: 20px;">
      <li>Confirm your email (click the button above)</li>
      <li>Browse our upcoming mentorship sessions</li>
      <li>Book your first session with current high school students</li>
      <li>Get personalized guidance for your freshman year</li>
    </ul>

    <p style="color: #333; line-height: 1.6; margin-top: 25px;">
      <strong>Need help?</strong> Reply to this email or contact us at
      <a href="mailto:vallearningco@gmail.com" style="color: #00d4aa; text-decoration: none;">vallearningco@gmail.com</a>
    </p>

  </div>

  <div style="text-align: center; margin-top: 30px; padding: 20px;">
    <p style="color: #333; margin: 0; font-size: 15px;">
      Best regards,<br>
      <strong style="color: #00f5d4;">The VAL Team</strong><br>
      <span style="color: #666; font-size: 14px;">Adrien, Nithin & Yashas</span>
    </p>

    <p style="color: #999; font-size: 12px; margin-top: 25px; line-height: 1.5;">
      If you didn't create an account with VAL, you can safely ignore this email.<br>
      This link will expire in 24 hours for security.
    </p>
  </div>

</div>
```

6. Click **"Save"** at the bottom

---

## 📧 Step 2: Customize Magic Link Email (Optional)

If you want to use magic links for passwordless login later:

1. In the same Email Templates section
2. Select **"Magic Link"** from the dropdown
3. Use this template:

```html
<h2>Sign in to VAL 🔐</h2>

<p>Hi there,</p>

<p>Click the button below to sign in to your <strong>VAL (Value Added Learning)</strong> account:</p>

<p style="text-align: center; margin: 30px 0;">
  <a href="{{ .ConfirmationURL }}" 
     style="background: linear-gradient(135deg, #00f5d4 0%, #00d4aa 100%); 
            color: #1a1a1a; 
            padding: 14px 32px; 
            text-decoration: none; 
            border-radius: 10px; 
            font-weight: 600;
            display: inline-block;">
    Sign In to VAL
  </a>
</p>

<p>Or copy and paste this link into your browser:</p>
<p style="word-break: break-all; color: #666;">{{ .ConfirmationURL }}</p>

<p style="color: #999; margin-top: 30px;">
  This link will expire in 1 hour for security reasons.
</p>

<p style="margin-top: 30px;">
  Best regards,<br>
  <strong>The VAL Team</strong>
</p>

<p style="color: #999; font-size: 12px; margin-top: 30px;">
  If you didn't request this email, you can safely ignore it.
</p>
```

4. Click **"Save"**

---

## 📧 Step 3: Customize Password Reset Email

1. Select **"Reset Password"** from the dropdown
2. Use this template:

```html
<h2>Reset Your VAL Password 🔑</h2>

<p>Hi there,</p>

<p>We received a request to reset your password for your <strong>VAL (Value Added Learning)</strong> account.</p>

<p>Click the button below to create a new password:</p>

<p style="text-align: center; margin: 30px 0;">
  <a href="{{ .ConfirmationURL }}" 
     style="background: linear-gradient(135deg, #00f5d4 0%, #00d4aa 100%); 
            color: #1a1a1a; 
            padding: 14px 32px; 
            text-decoration: none; 
            border-radius: 10px; 
            font-weight: 600;
            display: inline-block;">
    Reset Password
  </a>
</p>

<p>Or copy and paste this link into your browser:</p>
<p style="word-break: break-all; color: #666;">{{ .ConfirmationURL }}</p>

<p style="color: #999; margin-top: 30px;">
  This link will expire in 1 hour for security reasons.
</p>

<p style="margin-top: 30px;">
  Best regards,<br>
  <strong>The VAL Team</strong>
</p>

<p style="color: #999; font-size: 12px; margin-top: 30px;">
  If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.
</p>
```

3. Click **"Save"**

---

## 📧 Step 4: Customize Email Change Confirmation

1. Select **"Change Email Address"** from the dropdown
2. Use this template:

```html
<h2>Confirm Your New Email Address 📧</h2>

<p>Hi there,</p>

<p>You recently requested to change the email address for your <strong>VAL (Value Added Learning)</strong> account.</p>

<p>Click the button below to confirm your new email address:</p>

<p style="text-align: center; margin: 30px 0;">
  <a href="{{ .ConfirmationURL }}" 
     style="background: linear-gradient(135deg, #00f5d4 0%, #00d4aa 100%); 
            color: #1a1a1a; 
            padding: 14px 32px; 
            text-decoration: none; 
            border-radius: 10px; 
            font-weight: 600;
            display: inline-block;">
    Confirm New Email
  </a>
</p>

<p>Or copy and paste this link into your browser:</p>
<p style="word-break: break-all; color: #666;">{{ .ConfirmationURL }}</p>

<p style="margin-top: 30px;">
  Best regards,<br>
  <strong>The VAL Team</strong>
</p>

<p style="color: #999; font-size: 12px; margin-top: 30px;">
  If you didn't request this change, please contact us immediately at vallearningco@gmail.com
</p>
```

3. Click **"Save"**

---

## ✅ What This Fixes

✅ **VAL Branding** - Emails now mention VAL and your mission  
✅ **Professional Look** - Cyan/turquoise gradient buttons matching your website  
✅ **Clear Instructions** - Users know exactly what to do  
✅ **Helpful Context** - Explains what VAL is and what's next  
✅ **Contact Info** - Includes your email for support  
✅ **Team Signature** - Personal touch with founders' names  

---

## 🎨 Email Features

- **VAL Logo Emoji** 🎓 - Makes emails recognizable
- **Gradient Button** - Matches your website's cyan/turquoise theme
- **Clear CTAs** - Big, obvious buttons
- **Fallback Links** - Plain text URLs for email clients that block buttons
- **Security Notes** - Explains expiration times and what to do if they didn't request it
- **Next Steps** - Tells users what happens after confirmation

---

## 🧪 Test Your Emails

After customizing:

1. Sign up with a new test email
2. Check your inbox
3. Verify the email looks good and is VAL-branded
4. Click the confirmation link
5. Make sure it redirects properly

---

## 🔧 Troubleshooting

**Emails going to spam:**
- Check your Supabase email settings
- Consider using a custom domain for emails (advanced)
- Ask users to check spam folder

**Confirmation link not working:**
- Make sure you saved the template
- Check that the `{{ .ConfirmationURL }}` variable is included
- Verify your site URL is set correctly in Supabase settings

**Emails not sending:**
- Check Supabase logs in the dashboard
- Verify email confirmation is enabled in Auth settings
- Make sure you're using a valid email address

---

## 📝 Next Steps

1. **Customize all 4 email templates** (takes 5 minutes)
2. **Test with a new signup** to see the branded email
3. **Adjust styling** if needed (colors, text, etc.)
4. **Consider custom domain** for emails later (optional)

---

**Your emails will now be professional, branded, and clearly explain what VAL is!** 🎉

