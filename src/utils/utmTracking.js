// UTM Parameter Tracking Utility
// Captures and stores UTM parameters and referrer information for conversion tracking

/**
 * Extract UTM parameters from URL
 */
export const extractUTMParams = () => {
  if (typeof window === 'undefined') return {};
  
  const urlParams = new URLSearchParams(window.location.search);
  const utmParams = {};
  
  // Standard UTM parameters
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  
  utmKeys.forEach(key => {
    const value = urlParams.get(key);
    if (value) {
      utmParams[key] = value;
    }
  });
  
  return utmParams;
};

/**
 * Get referrer information
 */
export const getReferrerInfo = () => {
  if (typeof window === 'undefined') return {};
  
  return {
    referrer: document.referrer || '',
    referrerDomain: document.referrer ? new URL(document.referrer).hostname : '',
    isLandingPage: document.referrer ? document.referrer.includes('iterumfoods.xyz') : false,
    isDirect: !document.referrer || document.referrer === window.location.href
  };
};

/**
 * Store UTM parameters and referrer in sessionStorage
 * SessionStorage persists for the session but clears when tab closes
 */
export const storeTrackingParams = () => {
  if (typeof window === 'undefined') return;
  
  const utmParams = extractUTMParams();
  const referrerInfo = getReferrerInfo();
  
  // Only store if we have UTM params or referrer info
  if (Object.keys(utmParams).length > 0 || referrerInfo.referrer) {
    const trackingData = {
      utm: utmParams,
      referrer: referrerInfo,
      timestamp: new Date().toISOString(),
      landingUrl: window.location.href
    };
    
    // Store in sessionStorage (persists for session)
    sessionStorage.setItem('conversion_tracking', JSON.stringify(trackingData));
    
    // Also store in localStorage for longer persistence (30 days)
    // This allows attribution even if user returns later
    const longTermData = {
      ...trackingData,
      firstVisit: localStorage.getItem('conversion_tracking_first_visit') || new Date().toISOString()
    };
    
    if (Object.keys(utmParams).length > 0) {
      // Only update if we have UTM params (to preserve first attribution)
      localStorage.setItem('conversion_tracking', JSON.stringify(longTermData));
      localStorage.setItem('conversion_tracking_first_visit', longTermData.firstVisit);
    }
  }
};

/**
 * Get stored tracking parameters
 */
export const getStoredTrackingParams = () => {
  if (typeof window === 'undefined') return {};
  
  // Try sessionStorage first (current session)
  const sessionData = sessionStorage.getItem('conversion_tracking');
  if (sessionData) {
    try {
      return JSON.parse(sessionData);
    } catch (e) {
      console.error('Error parsing session tracking data:', e);
    }
  }
  
  // Fallback to localStorage (longer persistence)
  const localData = localStorage.getItem('conversion_tracking');
  if (localData) {
    try {
      return JSON.parse(localData);
    } catch (e) {
      console.error('Error parsing local tracking data:', e);
    }
  }
  
  return {};
};

/**
 * Get tracking parameters for analytics events
 * Combines stored params with current referrer
 */
export const getTrackingParams = () => {
  const stored = getStoredTrackingParams();
  const currentReferrer = getReferrerInfo();
  
  return {
    ...stored.utm,
    referrer: currentReferrer.referrer || stored.referrer?.referrer || '',
    referrer_domain: currentReferrer.referrerDomain || stored.referrer?.referrerDomain || '',
    is_landing_page: currentReferrer.isLandingPage || stored.referrer?.isLandingPage || false,
    source: stored.utm?.utm_source || (currentReferrer.isLandingPage ? 'landing' : 'direct'),
    medium: stored.utm?.utm_medium || 'website',
    campaign: stored.utm?.utm_campaign || 'organic',
    landing_url: stored.landingUrl || window.location.href
  };
};

/**
 * Initialize tracking on page load
 * Should be called early in app initialization
 */
export const initializeTracking = () => {
  if (typeof window === 'undefined') return;
  
  // Store tracking parameters
  storeTrackingParams();
  
  // Log for debugging (only in development)
  if (process.env.NODE_ENV === 'development') {
    const params = getTrackingParams();
    if (Object.keys(params).length > 0) {
      console.log('Conversion Tracking:', params);
    }
  }
};

/**
 * Clear tracking parameters (optional, for testing)
 */
export const clearTrackingParams = () => {
  if (typeof window === 'undefined') return;
  
  sessionStorage.removeItem('conversion_tracking');
  localStorage.removeItem('conversion_tracking');
  localStorage.removeItem('conversion_tracking_first_visit');
};

