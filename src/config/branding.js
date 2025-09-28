// Branding Configuration for Iterum Foods
// Updated to match existing iterumfoods.xyz website

export const branding = {
  // Colors - Matching your existing website
  colors: {
    // Primary brand color (green theme from your site)
    primary: '#22c55e',        // Main green from your site
    
    // Secondary colors
    secondary: '#16a34a',      // Darker green
    accent: '#fbbf24',         // Amber accent (from your site)
    
    // Text colors
    text: '#1f2937',           // Dark gray for main text
    textLight: '#6b7280',      // Medium gray for secondary text
    textDark: '#111827',       // Very dark for headings
    
    // Background colors
    background: '#ffffff',     // White background
    backgroundAlt: '#f8fafc',  // Light gray background
    backgroundDark: '#1f2937', // Dark background
    
    // Status colors
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    
    // Natural/culinary theme colors
    natural: '#365314',        // Dark green from your gradient
    naturalLight: '#4ade80',   // Light green
    earth: '#92400e',          // Earth tone
  },

  // Typography - Matching your existing fonts
  fonts: {
    heading: "'Playfair Display', serif",  // Elegant serif from your site
    body: "'Inter', sans-serif",           // Clean sans-serif
    mono: "'Fira Code', monospace",
  },

  // Logo and brand elements
  logo: {
    text: '🌿 ITERUM FOODS',
    subtext: 'Complete Culinary & Restaurant Solutions Platform',
    // Natural/culinary theme
    icon: '🌿',
  },

  // Spacing and sizing
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
  },

  // Border radius
  borderRadius: {
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    full: '9999px',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },

  // Breakpoints for responsive design
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Theme-specific styles
  theme: {
    gradient: {
      primary: 'linear-gradient(135deg, #2d5016 0%, #365314 50%, #1a2e05 100%)',
      hero: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
      card: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
    },
    pattern: {
      hero: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3Ccircle cx='10' cy='10' r='0.5'/%3E%3Ccircle cx='50' cy='50' r='0.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    }
  }
};

// Helper functions for consistent styling
export const getBrandedStyles = (element) => {
  const styles = {
    button: {
      primary: {
        background: branding.theme.gradient.hero,
        color: 'white',
        border: 'none',
        borderRadius: branding.borderRadius.md,
        padding: `${branding.spacing.md} ${branding.spacing.xl}`,
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: '0 4px 14px rgba(34, 197, 94, 0.3)',
      },
      secondary: {
        backgroundColor: 'transparent',
        color: branding.colors.primary,
        border: `2px solid ${branding.colors.primary}`,
        borderRadius: branding.borderRadius.md,
        padding: `${branding.spacing.md} ${branding.spacing.xl}`,
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      },
      cta: {
        background: branding.theme.gradient.hero,
        color: 'white',
        fontWeight: '600',
        boxShadow: '0 4px 14px rgba(34, 197, 94, 0.3)',
        border: 'none',
        borderRadius: '12px',
        transition: 'all 0.3s ease',
      }
    },
    card: {
      backgroundColor: branding.colors.background,
      borderRadius: branding.borderRadius.xl,
      boxShadow: branding.shadows.lg,
      padding: branding.spacing.xl,
      border: '1px solid #e2e8f0',
    },
    heading: {
      fontFamily: branding.fonts.heading,
      color: branding.colors.text,
      fontWeight: 'bold',
    },
    text: {
      fontFamily: branding.fonts.body,
      color: branding.colors.text,
    },
    textLight: {
      fontFamily: branding.fonts.body,
      color: branding.colors.textLight,
    },
    hero: {
      background: branding.theme.gradient.primary,
      backgroundImage: branding.theme.pattern.hero,
      color: 'white',
    }
  };

  return styles[element] || {};
};

// CSS custom properties for easy theming
export const generateCSSVariables = () => {
  const cssVars = [];
  
  // Colors
  Object.entries(branding.colors).forEach(([key, value]) => {
    cssVars.push(`--color-${key}: ${value};`);
  });
  
  // Fonts
  Object.entries(branding.fonts).forEach(([key, value]) => {
    cssVars.push(`--font-${key}: ${value};`);
  });
  
  // Spacing
  Object.entries(branding.spacing).forEach(([key, value]) => {
    cssVars.push(`--spacing-${key}: ${value};`);
  });
  
  return cssVars.join('\n');
};

export default branding;
