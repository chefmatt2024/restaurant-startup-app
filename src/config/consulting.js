/**
 * Iterum Consulting — all CTAs point to iterumfoods.com
 */
const CONSULTING_URL = 'https://iterumfoods.com';

export const CONSULTING_BOOKING_URL = CONSULTING_URL;

export const getConsultingUrl = (utmContent = '') => {
  const params = new URLSearchParams({
    utm_source: 'restauranteur_app',
    utm_medium: 'website',
    utm_campaign: 'consulting',
    ...(utmContent && { utm_content: utmContent }),
  });
  return `${CONSULTING_URL}?${params.toString()}`;
};
