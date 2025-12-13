# Netlify Environment Variables Checklist

## Required Environment Variables for Netlify

When deploying to Netlify, you **MUST** set these environment variables in the Netlify dashboard:

### 1. Backend API URL
```
VITE_API_URL=https://scholarstream-server36.vercel.app
```

### 2. Stripe Configuration
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51SMCA44BED7vIl5cNNn0YihaWJuAemheVwUhmrHIXWM6KCMcGkvjUgb7FNtgreZv3P7XSuhOnx5QlWVcbw6mJ67c00cGDbSH4r
```

### 3. Firebase Configuration
```
VITE_FIREBASE_API_KEY=AIzaSyA-Veh6HWoxTBqo15ztH2mecUIW8vmnOx4
VITE_FIREBASE_AUTH_DOMAIN=scholarstream-b1b45.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=scholarstream-b1b45
VITE_FIREBASE_STORAGE_BUCKET=scholarstream-b1b45.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=616880050808
VITE_FIREBASE_APP_ID=1:616880050808:web:b2ace53e38a189538d138d
```

---

## How to Set Environment Variables in Netlify

1. **Go to your Netlify dashboard**: https://app.netlify.com
2. **Select your site**: scholarstream-client36
3. **Navigate to**: Site settings → Environment variables
4. **Click**: "Add a variable"
5. **For each variable above**:
   - Key: Copy the variable name (e.g., `VITE_API_URL`)
   - Value: Copy the variable value
   - Scope: Select "All" or "Production"
   - Click "Create variable"

---

## After Adding Variables

1. **Redeploy your site**:
   - Go to Deploys tab
   - Click "Trigger deploy"
   - Select "Clear cache and deploy site"

2. **Verify deployment**:
   - Check that scholarships load on home page
   - Test scholarship details page
   - Test payment functionality
   - Verify admin login works

---

## Current Deployment Issues

### Issue 1: 404 on Page Refresh ✅ FIXED
- **Solution**: Added `_redirects` file in `public` folder
- **File**: `public/_redirects` contains `/*    /index.html   200`
- **Status**: Fixed - redeploy the `dist` folder

### Issue 2: Payment Not Working ⚠️ NEEDS FIX
- **Cause**: Missing `VITE_STRIPE_PUBLISHABLE_KEY` in Netlify
- **Solution**: Add the Stripe publishable key to Netlify environment variables
- **Status**: Requires environment variable setup

### Issue 3: API Calls Failing (if applicable)
- **Cause**: Missing `VITE_API_URL` or incorrect Firebase config
- **Solution**: Add all environment variables listed above
- **Status**: Requires environment variable setup

---

## Troubleshooting

### Payment errors:
- Check browser console for Stripe errors
- Verify `VITE_STRIPE_PUBLISHABLE_KEY` is set correctly
- Ensure backend has correct `STRIPE_SECRET_KEY`

### API not loading data:
- Verify `VITE_API_URL` is set
- Check Network tab for failed requests
- Verify CORS is configured on backend

### Authentication issues:
- Verify all Firebase environment variables are set
- Check Firebase console for project configuration

---

## Manual Deploy vs Auto Deploy

### Manual Deploy (Current Method)
- Upload `dist` folder manually
- Need to set environment variables in Netlify dashboard
- `_redirects` file must be in `dist` folder

### Auto Deploy (Recommended)
1. Connect GitHub repo to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Set environment variables
5. Auto-deploy on every git push

---

## Deployment Checklist

- [x] Backend deployed to Vercel
- [x] Frontend built with latest changes
- [x] `_redirects` file added for SPA routing
- [ ] Environment variables set in Netlify
- [ ] Deploy `dist` folder to Netlify
- [ ] Test all functionality after deployment

---

**Last Updated**: December 13, 2025
