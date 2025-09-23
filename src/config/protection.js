// Protection Configuration
export const PROTECTION_CONFIG = {
  // Environment
  ENVIRONMENT: process.env.NODE_ENV || 'development',
  
  // Access Control
  ACCESS_LEVEL: process.env.REACT_APP_ACCESS_LEVEL || 'beta',
  ENABLE_ACCESS_CONTROL: process.env.REACT_APP_ENABLE_ACCESS_CONTROL !== 'false',
  
  // Feature Flags
  FEATURES: {
    EQUIPMENT_PLANNING: process.env.REACT_APP_FEATURE_EQUIPMENT_PLANNING !== 'false',
    BUSINESS_CARD_OCR: process.env.REACT_APP_FEATURE_BUSINESS_CARD_OCR !== 'false',
    URL_IMPORT: process.env.REACT_APP_FEATURE_URL_IMPORT !== 'false',
    BUDGET_TRACKER: process.env.REACT_APP_FEATURE_BUDGET_TRACKER !== 'false',
    VENDOR_MANAGEMENT: process.env.REACT_APP_FEATURE_VENDOR_MANAGEMENT !== 'false',
    COMPLIANCE_TRACKING: process.env.REACT_APP_FEATURE_COMPLIANCE_TRACKING !== 'false',
  },
  
  // Security Settings
  SECURITY: {
    ENABLE_CSP: process.env.REACT_APP_ENABLE_CSP !== 'false',
    ENABLE_CORS: process.env.REACT_APP_ENABLE_CORS !== 'false',
    SESSION_TIMEOUT: parseInt(process.env.REACT_APP_SESSION_TIMEOUT) || 3600000, // 1 hour
    ENABLE_RATE_LIMITING: process.env.REACT_APP_ENABLE_RATE_LIMITING !== 'false',
  },
  
  // Analytics & Tracking
  ANALYTICS: {
    ENABLED: process.env.REACT_APP_ENABLE_ANALYTICS !== 'false',
    ENABLE_TRACKING: process.env.REACT_APP_ENABLE_TRACKING !== 'false',
    ENABLE_WATERMARKING: process.env.REACT_APP_ENABLE_WATERMARKING !== 'false',
  },
  
  // Rate Limiting
  RATE_LIMITS: {
    EQUIPMENT_IMPORT: { max: 10, window: 3600000 }, // 10 per hour
    VENDOR_ADD: { max: 5, window: 3600000 }, // 5 per hour
    DOCUMENT_UPLOAD: { max: 20, window: 3600000 }, // 20 per hour
    API_CALLS: { max: 100, window: 3600000 }, // 100 per hour
  },
  
  // Beta Testing
  BETA_TESTING: {
    ENABLED: true,
    REQUIRE_TERMS: true,
    REQUIRE_AUTH: true,
    COLLECT_FEEDBACK: true,
  },
  
  // Watermarking
  WATERMARKING: {
    ENABLED: process.env.REACT_APP_ENABLE_WATERMARKING !== 'false',
    INCLUDE_USER_ID: true,
    INCLUDE_TIMESTAMP: true,
    INCLUDE_SESSION_ID: true,
  }
};

export default PROTECTION_CONFIG;
