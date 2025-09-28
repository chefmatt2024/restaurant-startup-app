# Branding Extraction Guide

## 🎨 **How to Extract Branding from Your Existing iterumfoods.xyz Site**

This guide will help you identify and extract the exact branding elements from your current landing page to ensure perfect consistency with your restaurant planning app.

---

## 🔍 **Step 1: Identify Your Brand Elements**

### **A. Colors**
Visit your `iterumfoods.xyz` site and identify these key colors:

#### **Primary Brand Color**
- Look for your main logo color
- Check the color of your primary CTA buttons
- Note the header/navigation background color

#### **Secondary Colors**
- Accent colors used for highlights
- Secondary button colors
- Background colors for sections

#### **Text Colors**
- Main heading text color
- Body text color
- Light/secondary text color

### **B. Typography**
Identify the fonts used on your site:

#### **Heading Font**
- Check the font used for main headings (H1, H2, H3)
- Look in browser dev tools: Right-click → Inspect → Computed → font-family

#### **Body Font**
- Check the font used for paragraph text
- Usually the same as heading font or a complementary font

### **C. Logo and Branding**
- Your logo text/name
- Any taglines or subtext
- Logo image (if you have one)

---

## 🛠️ **Step 2: Extract Colors Using Browser Tools**

### **Method 1: Browser Developer Tools**
1. **Right-click** on any colored element on your site
2. **Select "Inspect Element"**
3. **Look for the "Computed" tab**
4. **Find the color property** and click on the color square
5. **Copy the hex value** (e.g., #667eea)

### **Method 2: Color Picker Extension**
Install a browser extension like "ColorZilla" to easily pick colors from your site.

### **Method 3: Screenshot + Color Picker**
1. Take a screenshot of your site
2. Use an image editor or online color picker
3. Identify the hex values of key colors

---

## 📝 **Step 3: Update the Branding Configuration**

Once you've identified your brand elements, update the `src/config/branding.js` file:

### **Example Update:**
```javascript
export const branding = {
  colors: {
    // Replace these with your actual colors
    primary: '#your-primary-color',      // e.g., '#1a365d'
    secondary: '#your-secondary-color',  // e.g., '#2d3748'
    accent: '#your-accent-color',        // e.g., '#ed8936'
    text: '#your-text-color',            // e.g., '#2d3748'
    textLight: '#your-light-text',       // e.g., '#718096'
    background: '#your-background',      // e.g., '#ffffff'
    backgroundAlt: '#your-alt-bg',       // e.g., '#f7fafc'
  },
  
  fonts: {
    // Replace with your actual fonts
    heading: 'Your-Heading-Font, sans-serif',
    body: 'Your-Body-Font, sans-serif',
  },
  
  logo: {
    text: 'Your Brand Name',
    subtext: 'Your Tagline',
  },
};
```

---

## 🎯 **Step 4: Common Branding Elements to Look For**

### **Navigation Bar**
- Background color
- Text color
- Logo/name styling
- Button colors

### **Hero Section**
- Background color/gradient
- Heading text color and font
- CTA button colors
- Subheading text color

### **Feature Sections**
- Section background colors
- Icon colors
- Heading colors
- Text colors

### **Footer**
- Background color
- Text colors
- Link colors
- Logo styling

---

## 🔧 **Step 5: Quick Color Extraction**

### **For Each Color, Note:**
1. **Where it's used** (navigation, buttons, text, etc.)
2. **The hex value** (#ffffff)
3. **The purpose** (primary, secondary, text, background)

### **Example Color Mapping:**
```javascript
// From your iterumfoods.xyz site:
primary: '#1a365d',        // Main navigation background
secondary: '#2d3748',      // Secondary buttons
accent: '#ed8936',         // CTA buttons
text: '#2d3748',           // Main headings
textLight: '#718096',      // Body text
background: '#ffffff',     // Main background
backgroundAlt: '#f7fafc',  // Section backgrounds
```

---

## 📱 **Step 6: Responsive Considerations**

Make sure to check your branding on different screen sizes:
- **Desktop** (1920px+)
- **Tablet** (768px - 1024px)
- **Mobile** (320px - 768px)

Some colors might look different or need adjustment on smaller screens.

---

## ✅ **Step 7: Test Your Branding**

After updating the branding configuration:

1. **Build the app**: `npm run build`
2. **Check the landing page** for color consistency
3. **Compare with your original site** side by side
4. **Make adjustments** as needed

---

## 🚀 **Quick Start Template**

If you want to get started quickly, here's a template you can customize:

```javascript
// Quick branding template - customize these values
export const branding = {
  colors: {
    primary: '#1a365d',      // Main brand color
    secondary: '#2d3748',    // Secondary color
    accent: '#ed8936',       // Accent color
    text: '#2d3748',         // Main text
    textLight: '#718096',    // Light text
    background: '#ffffff',   // Background
    backgroundAlt: '#f7fafc', // Alt background
  },
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
  },
  logo: {
    text: 'Iterum Foods',
    subtext: 'Restaurant Planning Platform',
  },
};
```

---

## 🆘 **Need Help?**

If you're having trouble identifying your brand colors or fonts:

1. **Share a screenshot** of your iterumfoods.xyz site
2. **Tell me the main colors** you see
3. **Describe the overall style** (modern, classic, bold, etc.)

I can help you create a custom branding configuration that matches your existing site perfectly!

---

## 📋 **Checklist**

- [ ] Identify primary brand color
- [ ] Identify secondary colors
- [ ] Identify text colors
- [ ] Identify fonts used
- [ ] Update branding configuration
- [ ] Test the updated styling
- [ ] Compare with original site
- [ ] Make final adjustments

Once you've completed this checklist, your restaurant planning app will have perfect branding consistency with your existing iterumfoods.xyz site!
