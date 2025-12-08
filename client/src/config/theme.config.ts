/**
 * Theme Configuration
 *
 * Customize your application's color scheme here.
 * All colors should be in hex format.
 */

export const themeConfig = {
  colors: {
    // Primary brand color - used for accents, active states, buttons
    primary: '#3cca70',
    primaryHover: '#34b563',
    primaryLight: '#e6f9ef',

    // Text colors
    textPrimary: '#062d54',
    textSecondary: '#2a4d73',
    textMuted: '#5a7a99',
    textLight: '#8aa3ba',

    // Background colors
    bgPrimary: '#ffffff',
    bgSecondary: '#f8fafb',
    bgTertiary: '#e8ecf0',
    bgHover: '#f1f5f8',

    // Border colors
    border: '#e1e8ef',
    borderLight: '#f0f4f7',

    // Status colors (optional - for future use)
    success: '#3cca70',
    error: '#ef4444',
    errorHover: '#dc2626',
    errorLight: '#fee2e2',
    warning: '#f59e0b',
    info: '#3b82f6',
  },

  // Gradient configurations
  gradients: {
    avatar: 'linear-gradient(135deg, #3cca70 0%, #2a9d5a 100%)',
    button: 'linear-gradient(135deg, #3cca70 0%, #34b563 100%)',
  },

  // Border radius
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    full: '9999px',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(6, 45, 84, 0.05)',
    md: '0 4px 6px -1px rgba(6, 45, 84, 0.1)',
    lg: '0 10px 15px -3px rgba(6, 45, 84, 0.1)',
    xl: '0 20px 25px -5px rgba(6, 45, 84, 0.1)',
  },
};

// Helper function to get color with opacity
export const withOpacity = (color: string, opacity: number): string => {
  // Convert hex to rgba
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Export individual color groups for easier access
export const colors = themeConfig.colors;
export const gradients = themeConfig.gradients;
export const borderRadius = themeConfig.borderRadius;
export const shadows = themeConfig.shadows;
