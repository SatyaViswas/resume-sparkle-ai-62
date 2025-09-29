# 🔍 Resume Reviewer Troubleshooting Checklist

## Quick Diagnosis Steps:

### ✅ **Check 1: Website Status**
- [ ] Website is running at http://localhost:8081/
- [ ] Resume Reviewer page loads without errors
- [ ] File upload button works (doesn't crash)

### ✅ **Check 2: API Key Issues**
Common problems with Cohere API keys:

**❌ Wrong Format:**
- Key should start with `co_` (like `co_abc123xyz789`)
- NOT `Bearer co_abc123` or just random letters/numbers

**❌ Invalid/Expired Key:**
- Key was copied incorrectly (missing characters)
- Account suspended or trial expired
- Key was regenerated on Cohere dashboard

**❌ Account Issues:**
- Cohere account needs verification
- Hit usage limits
- Payment required for continued usage

### ✅ **Check 3: Test Results**
When you test, you should see:

**✅ Working Correctly:**
- Real ATS scores (like 78, 84, 92)
- Specific strengths like "Strong technical skills in React and Node.js"
- Detailed career paths with percentages
- Custom weaknesses and improvements

**❌ Using Fallback Data:**
- Generic messages like "Resume uploaded successfully"
- ATS score missing or 0
- Only 1 career path (usually "Business Analyst")
- Generic improvements like "Review and optimize sections"

## 🎯 **Most Likely Solutions:**

### **Solution 1: Get Fresh API Key**
1. Go to https://dashboard.cohere.ai/
2. Delete old API key
3. Create brand new key
4. Update with: `supabase secrets set COHERE_API_KEY="co_your_new_key"`
5. Redeploy functions

### **Solution 2: Check Account Status**
- Verify email on Cohere account
- Check if trial expired
- Add payment method if required
- Look for any account notifications

### **Solution 3: Try Different Key Format**
Some users have success with:
```bash
supabase secrets set COHERE_API_KEY='co_your_key_here'
# Note: single quotes instead of double quotes
```

## 🧪 **Testing Commands:**
```bash
# Test API key is set
supabase secrets list | grep COHERE

# Test function works  
node test-cohere-api.js

# Redeploy if needed
supabase functions deploy analyze-resume
```

## 📞 **If Still Not Working:**
1. Share screenshot of test page results
2. Share what the API key starts with (first 5 characters: `co_ab...`)
3. Check Cohere dashboard for any error messages
4. Try creating completely new Cohere account if needed