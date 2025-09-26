// Analytics and Data Collection Service
import { authService } from './firebase';

// Analytics configuration
const ANALYTICS_CONFIG = {
  ENABLED: true,
  DEBUG: process.env.NODE_ENV === 'development',
  BATCH_SIZE: 10,
  FLUSH_INTERVAL: 30000, // 30 seconds
  MAX_RETRIES: 3,
  ENDPOINT: '/api/analytics' // In production, this would be your analytics endpoint
};

// Event types for tracking
export const EVENT_TYPES = {
  // User Actions
  USER_SIGNUP: 'user_signup',
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',
  USER_PROFILE_UPDATE: 'user_profile_update',
  
  // Feature Usage
  FEATURE_ACCESS: 'feature_access',
  FEATURE_COMPLETION: 'feature_completion',
  FEATURE_ABANDONMENT: 'feature_abandonment',
  
  // Equipment Planning
  EQUIPMENT_ADD: 'equipment_add',
  EQUIPMENT_IMPORT: 'equipment_import',
  EQUIPMENT_TEMPLATE_USE: 'equipment_template_use',
  EQUIPMENT_BUDGET_UPDATE: 'equipment_budget_update',
  
  // Business Planning
  BUSINESS_PLAN_SAVE: 'business_plan_save',
  BUSINESS_PLAN_SECTION_COMPLETE: 'business_plan_section_complete',
  BUSINESS_PLAN_EXPORT: 'business_plan_export',
  
  // Compliance
  COMPLIANCE_CHECKLIST_USE: 'compliance_checklist_use',
  DOCUMENT_UPLOAD: 'document_upload',
  COMPLIANCE_REMINDER_SET: 'compliance_reminder_set',
  
  // Vendor Management
  VENDOR_ADD: 'vendor_add',
  VENDOR_CARD_IMPORT: 'vendor_card_import',
  VENDOR_CONTACT: 'vendor_contact',
  
  // User Feedback
  FEEDBACK_SUBMIT: 'feedback_submit',
  BUG_REPORT: 'bug_report',
  FEATURE_REQUEST: 'feature_request',
  
  // Navigation
  PAGE_VIEW: 'page_view',
  SECTION_VIEW: 'section_view',
  MODAL_OPEN: 'modal_open',
  MODAL_CLOSE: 'modal_close',
  
  // Errors
  ERROR_OCCURRED: 'error_occurred',
  API_ERROR: 'api_error',
  VALIDATION_ERROR: 'validation_error'
};

// Data collection queue
let eventQueue = [];
let flushTimer = null;

class AnalyticsService {
  constructor() {
    this.initialize();
  }

  initialize() {
    if (ANALYTICS_CONFIG.ENABLED) {
      this.startFlushTimer();
      this.setupPageTracking();
      this.setupErrorTracking();
    }
  }

  // Track user events
  track(eventType, properties = {}) {
    if (!ANALYTICS_CONFIG.ENABLED) return;

    const user = authService.getCurrentUser();
    const event = {
      id: this.generateEventId(),
      eventType,
      properties: {
        ...properties,
        timestamp: Date.now(),
        userId: user?.uid || 'anonymous',
        userEmail: user?.email || null,
        sessionId: this.getSessionId(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        referrer: document.referrer,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        viewportSize: `${window.innerWidth}x${window.innerHeight}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language
      }
    };

    eventQueue.push(event);
    
    if (ANALYTICS_CONFIG.DEBUG) {
      console.log('Analytics Event:', event);
    }

    // Flush if queue is full
    if (eventQueue.length >= ANALYTICS_CONFIG.BATCH_SIZE) {
      this.flush();
    }
  }

  // Track feature usage
  trackFeatureUsage(feature, action, metadata = {}) {
    this.track(EVENT_TYPES.FEATURE_ACCESS, {
      feature,
      action,
      ...metadata
    });
  }

  // Track user journey
  trackUserJourney(step, data = {}) {
    this.track('user_journey', {
      step,
      ...data
    });
  }

  // Track business metrics
  trackBusinessMetric(metric, value, context = {}) {
    this.track('business_metric', {
      metric,
      value,
      ...context
    });
  }

  // Track user feedback
  trackFeedback(type, content, rating = null, metadata = {}) {
    this.track(EVENT_TYPES.FEEDBACK_SUBMIT, {
      feedbackType: type,
      content,
      rating,
      ...metadata
    });
  }

  // Track errors
  trackError(error, context = {}) {
    this.track(EVENT_TYPES.ERROR_OCCURRED, {
      errorMessage: error.message,
      errorStack: error.stack,
      errorName: error.name,
      ...context
    });
  }

  // Track performance
  trackPerformance(metric, value, context = {}) {
    this.track('performance_metric', {
      metric,
      value,
      ...context
    });
  }

  // Setup automatic page tracking
  setupPageTracking() {
    // Track initial page view
    this.track(EVENT_TYPES.PAGE_VIEW, {
      page: window.location.pathname,
      title: document.title
    });

    // Track route changes (if using React Router)
    window.addEventListener('popstate', () => {
      this.track(EVENT_TYPES.PAGE_VIEW, {
        page: window.location.pathname,
        title: document.title
      });
    });
  }

  // Setup error tracking
  setupErrorTracking() {
    window.addEventListener('error', (event) => {
      this.trackError(event.error, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.trackError(new Error(event.reason), {
        type: 'unhandled_promise_rejection'
      });
    });
  }

  // Start flush timer
  startFlushTimer() {
    if (flushTimer) clearInterval(flushTimer);
    
    flushTimer = setInterval(() => {
      if (eventQueue.length > 0) {
        this.flush();
      }
    }, ANALYTICS_CONFIG.FLUSH_INTERVAL);
  }

  // Flush events to server
  async flush() {
    if (eventQueue.length === 0) return;

    const events = [...eventQueue];
    eventQueue = [];

    try {
      // In production, send to your analytics server
      await this.sendToServer(events);
      
      if (ANALYTICS_CONFIG.DEBUG) {
        console.log(`Flushed ${events.length} events to server`);
      }
    } catch (error) {
      console.error('Failed to flush analytics events:', error);
      // Re-queue events for retry
      eventQueue.unshift(...events);
    }
  }

  // Send events to server
  async sendToServer(events) {
    // For now, store in localStorage for demo purposes
    // In production, this would send to your analytics API
    const stored = JSON.parse(localStorage.getItem('analytics_events') || '[]');
    stored.push(...events);
    
    // Keep only last 1000 events
    if (stored.length > 1000) {
      stored.splice(0, stored.length - 1000);
    }
    
    localStorage.setItem('analytics_events', JSON.stringify(stored));
    
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(resolve, 100);
    });
  }

  // Generate unique event ID
  generateEventId() {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get session ID
  getSessionId() {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  // Get analytics data
  getAnalyticsData() {
    return JSON.parse(localStorage.getItem('analytics_events') || '[]');
  }

  // Clear analytics data
  clearAnalyticsData() {
    localStorage.removeItem('analytics_events');
    eventQueue = [];
  }

  // Export analytics data
  exportAnalyticsData() {
    const data = this.getAnalyticsData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

// Create singleton instance
const analyticsService = new AnalyticsService();

export default analyticsService;
