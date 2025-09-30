# 🔧 DNS Troubleshooting Guide - SSL Certificate Issue

## Problem
Firebase is trying to verify your domain `iterumfoods.xyz` for SSL certificate generation, but it's still hitting your old GitHub Pages DNS records instead of the new Firebase records.

---

## 🚨 **Current Issue:**
- **Old DNS records**: Still pointing to GitHub Pages (185.199.108.153, etc.)
- **Firebase verification**: Failing because it can't reach the correct server
- **SSL certificate**: Cannot be generated until DNS is correct

---

## 🔍 **Diagnosis Steps**

### **1. Check Current DNS Status**
Visit: https://dnschecker.org/
- **Enter domain**: `iterumfoods.xyz`
- **Check A records**: Should show `151.101.1.195` and `151.101.65.195`
- **Check CNAME**: `www.iterumfoods.xyz` should point to `iterumfoods.xyz`

### **2. Verify DNS Propagation**
- **Global check**: https://www.whatsmydns.net/
- **Enter**: `iterumfoods.xyz`
- **Record type**: A
- **Expected values**: `151.101.1.195` and `151.101.65.195`

---

## 🛠️ **Solutions**

### **Option 1: Wait for DNS Propagation (Recommended)**
- **Time needed**: 5-60 minutes (can take up to 24 hours)
- **Check periodically**: Use DNS checker tools
- **Retry Firebase**: Once DNS shows correct records

### **Option 2: Force DNS Update**
If you're using Cloudflare:
1. **Go to Cloudflare DNS**
2. **Delete old A records**
3. **Add new Firebase A records**
4. **Toggle "Proxied" to "DNS only"**
5. **Wait 5 minutes, then toggle back to "Proxied"**

### **Option 3: Clear DNS Cache**
On your local machine:
```bash
# Windows
ipconfig /flushdns

# Mac
sudo dscacheutil -flushcache

# Linux
sudo systemctl restart systemd-resolved
```

---

## 📋 **Correct DNS Configuration**

### **A Records (Required):**
```
Type: A
Name: @
Value: 151.101.1.195
TTL: 3600

Type: A
Name: @
Value: 151.101.65.195
TTL: 3600
```

### **CNAME Record (Required):**
```
Type: CNAME
Name: www
Value: iterumfoods.xyz
TTL: 3600
```

### **Remove These Old Records:**
```
❌ A: 185.199.108.153
❌ A: 185.199.109.153
❌ A: 185.199.110.153
❌ A: 185.199.111.153
❌ CNAME: www → iterum-foods.github.io
```

---

## ⏱️ **Timeline Expectations**

### **Immediate (0-5 minutes):**
- DNS changes saved in your provider
- Local cache may still show old records

### **Short-term (5-60 minutes):**
- Most DNS servers updated globally
- Firebase verification should work

### **Full propagation (1-24 hours):**
- All DNS servers worldwide updated
- Consistent results across all locations

---

## 🔄 **Retry Firebase Verification**

### **Once DNS is Correct:**
1. **Go to Firebase Console**: https://console.firebase.google.com/project/restaurant-startup-app/hosting
2. **Click on `iterumfoods-landing` site**
3. **Click "Add custom domain"**
4. **Enter**: `iterumfoods.xyz`
5. **Choose verification method**:
   - **HTML file upload** (easiest)
   - **DNS TXT record** (alternative)

### **HTML File Upload Method:**
1. **Download verification file** from Firebase
2. **Upload to your domain root** (if you have hosting)
3. **Or use Firebase hosting** to serve the file

### **DNS TXT Record Method:**
1. **Copy TXT record** from Firebase
2. **Add to your DNS** settings
3. **Wait for propagation** (5-60 minutes)
4. **Click "Verify"** in Firebase

---

## 🚨 **Common Issues & Solutions**

### **Issue: Still showing old IPs**
**Solution**: 
- Wait longer for propagation
- Check if you have multiple DNS providers
- Clear your browser cache

### **Issue: Mixed old and new IPs**
**Solution**:
- This is normal during propagation
- Wait until all locations show new IPs
- Firebase will retry automatically

### **Issue: Firebase verification keeps failing**
**Solution**:
- Use HTML file upload method instead
- Check that file is accessible at `https://iterumfoods.xyz/verification-file.html`
- Ensure file is in root directory

### **Issue: SSL certificate not generating**
**Solution**:
- DNS must be 100% correct first
- Wait for full propagation
- Retry verification in Firebase

---

## 📊 **Monitoring Progress**

### **Check DNS Status:**
1. **https://dnschecker.org/** - Global DNS check
2. **https://www.whatsmydns.net/** - Propagation status
3. **https://toolbox.googleapps.com/apps/dig/** - Google's DNS tool

### **Expected Results:**
- **All locations** show `151.101.1.195` and `151.101.65.195`
- **No old GitHub IPs** (185.199.x.x) visible
- **Consistent results** across all tools

---

## 🎯 **Next Steps**

### **Immediate (Now):**
1. **Check current DNS** using tools above
2. **Verify you made the correct changes**
3. **Wait for propagation** if changes are correct

### **Once DNS is Correct:**
1. **Retry Firebase verification**
2. **Wait for SSL certificate** (5-10 minutes)
3. **Test your domain** at `https://iterumfoods.xyz`

### **After SSL is Active:**
1. **Test HTTPS redirects**
2. **Check security headers**
3. **Verify mobile performance**

---

## 💡 **Pro Tips**

### **Faster Propagation:**
- **Lower TTL** before making changes (set to 300 seconds)
- **Use Cloudflare** for faster global propagation
- **Clear local DNS cache** after changes

### **Verification Success:**
- **HTML file method** is usually more reliable
- **Check file accessibility** before verifying
- **Use incognito mode** to avoid cache issues

---

## 🆘 **If Still Having Issues**

### **Contact Your DNS Provider:**
- **GoDaddy**: Support chat or phone
- **Namecheap**: Live chat support
- **Cloudflare**: Community forum or support

### **Firebase Support:**
- **Firebase Console** → Help & Support
- **Google Cloud Support** (if you have support plan)
- **Firebase Community** forum

---

**The key is patience - DNS propagation can take time, but once it's correct, Firebase will automatically generate your SSL certificate!** 🔒

**Check your DNS status using the tools above and let me know what you see!** 📊
