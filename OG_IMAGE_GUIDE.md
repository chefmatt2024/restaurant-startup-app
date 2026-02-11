# 🖼️ Open Graph Image Guide

## What is an OG Image?

An Open Graph (OG) image is the image that appears when your website is shared on social media platforms like Facebook, Twitter, LinkedIn, etc.

## Current Status

- ✅ OG image is referenced in `public/index.html`
- ❌ Actual image file (`public/og-image.png`) needs to be created

## Image Specifications

- **Dimensions**: 1200 x 630 pixels (1.91:1 aspect ratio)
- **Format**: PNG or JPG
- **File size**: Under 1MB (recommended)
- **File name**: `og-image.png`
- **Location**: `public/og-image.png`

## What Should the Image Include?

### Recommended Design Elements:

1. **App Name**: "Restaurant Business Planner"
2. **Tagline**: "Plan Your Restaurant Like a Pro"
3. **Visual Elements**:
   - Restaurant/food imagery
   - Charts or graphs (representing financial planning)
   - Professional, clean design
4. **Brand Colors**: Use your brand colors (green, blue)
5. **Logo**: Iterum Foods logo (if available)

### Example Layout:

```
┌─────────────────────────────────────┐
│  [Logo]  Restaurant Business Planner │
│                                     │
│  Plan Your Restaurant Like a Pro   │
│                                     │
│  [Visual: Chart/Graph or Restaurant]│
│                                     │
│  iterumfoods.com                   │
└─────────────────────────────────────┘
```

## Tools to Create OG Image

### Free Options:
1. **Canva** - https://www.canva.com/
   - Use template: "Facebook Post" (1200x630)
   - Customize with your branding

2. **Figma** - https://www.figma.com/
   - Create custom 1200x630 design
   - Export as PNG

3. **Photoshop/GIMP**
   - Create custom design
   - Export as PNG

### Quick Template:
- Use a tool like Canva
- Search for "Open Graph" or "Facebook Post" templates
- Customize with your brand colors and text

## Steps to Add Image

1. **Create the image** using one of the tools above
2. **Save as** `og-image.png`
3. **Place in** `public/og-image.png` (in your project root)
4. **Verify** the image is accessible at:
   - `https://restaurant-startup-app.web.app/og-image.png`
5. **Test** using:
   - [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
   - [Twitter Card Validator](https://cards-dev.twitter.com/validator)
   - [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

## Alternative: Use a Service

You can also use services that generate OG images dynamically:
- [og-image.vercel.app](https://og-image.vercel.app/)
- Custom API endpoint that generates images

## Current Reference

The image is currently referenced in `public/index.html`:
```html
<meta property="og:image" content="%PUBLIC_URL%/og-image.png" />
<meta property="twitter:image" content="%PUBLIC_URL%/og-image.png" />
```

Once you create the image and place it in `public/`, it will automatically be used when the site is shared.

---

**Priority**: Medium - Important for social sharing, but not critical for launch


