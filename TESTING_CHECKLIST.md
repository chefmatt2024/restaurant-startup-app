# 🧪 Basic Testing Checklist

## Pre-Testing Setup ✅
- [x] Build completes successfully
- [x] No critical linting errors
- [x] Dependencies installed

---

## 1. Application Startup Test
**Time: 2 minutes**

### Steps:
1. Run `npm start`
2. Wait for app to load
3. Check browser console for errors

### Expected Results:
- [ ] App loads without errors
- [ ] No red errors in console
- [ ] Dashboard or landing page displays
- [ ] Navigation menu visible

### Issues Found:
- [ ] _______________________________________
- [ ] _______________________________________

---

## 2. Authentication Test
**Time: 3 minutes**

### Steps:
1. Try to access Dashboard without login
2. Sign up / Sign in
3. Verify user can access Dashboard after login

### Expected Results:
- [ ] Authentication modal appears when needed
- [ ] Can create new account
- [ ] Can sign in with existing account
- [ ] Dashboard accessible after login
- [ ] User data persists on refresh

### Issues Found:
- [ ] _______________________________________
- [ ] _______________________________________

---

## 3. Dashboard Overview Test
**Time: 3 minutes**

### Steps:
1. Navigate to Dashboard
2. Check progress indicators
3. Verify all tabs are accessible
4. Test draft creation

### Expected Results:
- [ ] Progress bars display correctly
- [ ] All navigation tabs work
- [ ] Can create new draft
- [ ] Draft list displays
- [ ] Can switch between drafts

### Issues Found:
- [ ] _______________________________________
- [ ] _______________________________________

---

## 4. Financial Projections Test
**Time: 5 minutes**

### Steps:
1. Navigate to Financial Projections tab
2. Test Restaurant Type selection (New vs Existing)
3. Enter sample data in Rent Calculator
4. Enter sample data in Sales Projections Calculator
5. Enter sample data in Management Cost Projector
6. Check calculations update correctly

### Expected Results:
- [ ] No errors when loading Financial Projections
- [ ] Restaurant Type selector works
- [ ] Rent Calculator calculates correctly
- [ ] Sales Projections Calculator works
- [ ] Management Cost Projector works
- [ ] Charts display properly
- [ ] "Apply to Financial Projections" buttons work

### Issues Found:
- [ ] _______________________________________
- [ ] _______________________________________

---

## 5. Business Plan Test
**Time: 5 minutes**

### Steps:
1. Navigate to Business Plan tab
2. Test Executive Summary form
3. Test Market Analysis tab
4. Fill in sample data
5. Verify data saves

### Expected Results:
- [ ] All business plan sections accessible
- [ ] Forms accept input
- [ ] Data saves correctly
- [ ] Can navigate between sections
- [ ] No form errors

### Issues Found:
- [ ] _______________________________________
- [ ] _______________________________________

---

## 6. AI Integration Test ⭐
**Time: 10 minutes**

### Steps:
1. Go to Executive Summary tab
2. Find "AI Writing Assistant" section
3. Test prompt: "Generate a mission statement for a modern Italian restaurant"
4. Wait for AI response
5. Go to Market Analysis tab
6. Test AI Research Panel
7. Go to Financial Projections tab
8. Test AI Financial Advisor

### Expected Results:
- [ ] AI Assistant UI displays correctly
- [ ] Can enter prompts
- [ ] AI responds within 10-15 seconds
- [ ] Responses are relevant and helpful
- [ ] No API key errors
- [ ] Error messages clear if API fails

### Issues Found:
- [ ] _______________________________________
- [ ] _______________________________________

### API Key Check:
- [ ] `.env.local` file exists
- [ ] `REACT_APP_OPENAI_API_KEY` is set
- [ ] API key starts with `sk-`
- [ ] No API key exposed in console

---

## 7. Document Generation Test
**Time: 5 minutes**

### Steps:
1. Navigate to Financial Projections tab
2. Scroll to "Generate Investor Documents"
3. Click "Generate Pitch Deck"
4. Wait for PDF generation
5. Verify PDF downloads
6. Test Business Plan generation
7. Test Financial Projections generation

### Expected Results:
- [ ] Document generation buttons visible
- [ ] PDFs generate successfully
- [ ] PDFs contain correct data
- [ ] No errors during generation
- [ ] PDFs download properly

### Issues Found:
- [ ] _______________________________________
- [ ] _______________________________________

---

## 8. Equipment Planning Test
**Time: 3 minutes**

### Steps:
1. Navigate to Equipment Planning tab
2. Browse equipment categories
3. Add items to list
4. Check vendor links work

### Expected Results:
- [ ] Equipment categories display
- [ ] Can add equipment items
- [ ] Vendor links open correctly
- [ ] Equipment list saves

### Issues Found:
- [ ] _______________________________________
- [ ] _______________________________________

---

## 9. Opening Plan Test
**Time: 3 minutes**

### Steps:
1. Navigate to Opening Plan tab
2. Check all phases display
3. Test task completion
4. Verify progress tracking

### Expected Results:
- [ ] All 6 phases visible
- [ ] Can mark tasks complete
- [ ] Progress updates correctly
- [ ] Timeline displays

### Issues Found:
- [ ] _______________________________________
- [ ] _______________________________________

---

## 10. Mobile Responsiveness Test
**Time: 5 minutes**

### Steps:
1. Open browser DevTools
2. Switch to mobile view (iPhone/Android)
3. Test navigation
4. Test forms
5. Test calculators
6. Test AI Assistant

### Expected Results:
- [ ] Navigation works on mobile
- [ ] Forms are usable
- [ ] Calculators display correctly
- [ ] Text is readable
- [ ] Buttons are tappable
- [ ] No horizontal scrolling

### Issues Found:
- [ ] _______________________________________
- [ ] _______________________________________

---

## 11. Data Persistence Test
**Time: 3 minutes**

### Steps:
1. Enter data in multiple sections
2. Refresh page
3. Verify data persists
4. Switch drafts
5. Verify draft data separate

### Expected Results:
- [ ] Data saves automatically
- [ ] Data persists on refresh
- [ ] Drafts are separate
- [ ] No data loss

### Issues Found:
- [ ] _______________________________________
- [ ] _______________________________________

---

## 12. Error Handling Test
**Time: 3 minutes**

### Steps:
1. Try invalid inputs
2. Test with missing data
3. Test network errors (disconnect internet)
4. Check error messages

### Expected Results:
- [ ] Invalid inputs handled gracefully
- [ ] Error messages are clear
- [ ] App doesn't crash
- [ ] Network errors handled

### Issues Found:
- [ ] _______________________________________
- [ ] _______________________________________

---

## Summary

### Critical Issues (Blocking):
- [ ] _______________________________________
- [ ] _______________________________________

### Medium Issues (Should Fix):
- [ ] _______________________________________
- [ ] _______________________________________

### Minor Issues (Nice to Have):
- [ ] _______________________________________
- [ ] _______________________________________

### Tested By: ________________
### Date: ________________
### Overall Status: ⬜ Pass ⬜ Pass with Issues ⬜ Fail

---

## Next Steps After Testing:
1. Fix critical issues
2. Address medium priority issues
3. Document minor issues for future
4. Deploy fixes to production
5. Re-test critical fixes

