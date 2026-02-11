# 🔥 Firebase Crashlytics Setup Guide

## Overview

Firebase Crashlytics provides real-time crash reporting for your app. This is recommended for production error tracking.

## Current Status

- ⚠️ **Basic error tracking** exists in `src/services/analytics.js`
- ❌ **Firebase Crashlytics** not yet configured
- ✅ **Firebase project** already set up

## Setup Steps

### Step 1: Enable Crashlytics in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **restaurant-startup-app**
3. Navigate to **Crashlytics** in the left menu
4. Click **"Get started"** or **"Enable Crashlytics"**
5. Follow the setup wizard

### Step 2: Install Firebase Crashlytics Package

```bash
npm install @react-native-firebase/crashlytics
```

**Note**: For React web apps, you'll use the Firebase JS SDK instead:

```bash
npm install firebase
```

The Firebase SDK already includes Crashlytics support for web.

### Step 3: Initialize Crashlytics

Update `src/services/firebase.js`:

```javascript
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getCrashlytics } from 'firebase/crashlytics';

// ... existing firebase config ...

// Initialize Crashlytics
const crashlytics = getCrashlytics();

export { crashlytics };
```

### Step 4: Integrate with Error Tracking

Update `src/services/analytics.js`:

```javascript
import { crashlytics } from './firebase';

// In the trackError method:
trackError(error, context = {}) {
  // Existing custom tracking
  this.track(EVENT_TYPES.ERROR_OCCURRED, {
    error: error.message,
    stack: error.stack,
    ...context
  });

  // Add Crashlytics reporting
  if (crashlytics) {
    crashlytics.recordError(error, {
      ...context,
      timestamp: Date.now()
    });
  }
}
```

### Step 5: Add Error Boundaries

Create `src/components/ErrorBoundary.js`:

```javascript
import React from 'react';
import { crashlytics } from '../services/firebase';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log to Crashlytics
    if (crashlytics) {
      crashlytics.recordError(error, {
        componentStack: errorInfo.componentStack
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>We've been notified and are working on a fix.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

### Step 6: Wrap App with Error Boundary

Update `src/App.js`:

```javascript
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <AppProvider>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </AppProvider>
  );
}
```

## Alternative: Use Sentry

If you prefer Sentry over Crashlytics:

### Install Sentry

```bash
npm install @sentry/react @sentry/tracing
```

### Initialize Sentry

```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

## What Gets Tracked

### Automatic Tracking:
- Unhandled JavaScript errors
- Unhandled promise rejections
- React component errors (via Error Boundary)

### Manual Tracking:
- Custom error contexts
- User actions before crashes
- Non-fatal errors

## Testing

### Test Crash Reporting:

1. Add a test error button (dev only):
```javascript
<button onClick={() => {
  throw new Error('Test crash');
}}>
  Test Crash
</button>
```

2. Trigger the error
3. Check Firebase Console → Crashlytics
4. Verify the crash appears within minutes

## Benefits

- ✅ Real-time crash reports
- ✅ Stack traces with source maps
- ✅ User impact metrics
- ✅ Crash-free user rate tracking
- ✅ Integration with Firebase Analytics

## Priority

**Medium Priority** - Important for production monitoring, but basic error tracking exists

---

**Note**: For immediate launch, the existing error tracking in `analytics.js` is sufficient. Crashlytics can be added post-launch if needed.


