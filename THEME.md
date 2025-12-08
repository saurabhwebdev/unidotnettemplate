# Theme Customization Guide

This template includes a centralized theme configuration system that allows you to easily customize the application's color scheme and visual appearance.

## Quick Start

All theme settings are located in the following file:

```
client/src/config/theme.config.ts
```

## Color Configuration

### Primary Colors

The main brand colors used for accents, buttons, and active states:

```typescript
primary: '#3cca70',        // Main brand color
primaryHover: '#34b563',   // Hover state for primary color
primaryLight: '#e6f9ef',   // Light background for active states
```

### Text Colors

Colors used for text throughout the application:

```typescript
textPrimary: '#062d54',    // Main text color (headings, important text)
textSecondary: '#2a4d73',  // Secondary text color
textMuted: '#5a7a99',      // Muted/disabled text
textLight: '#8aa3ba',      // Light text (less important)
```

### Background Colors

Background colors for different surfaces:

```typescript
bgPrimary: '#ffffff',      // Main background (cards, sidebar, header)
bgSecondary: '#f8fafb',    // Page background
bgHover: '#f1f5f8',        // Hover state background
```

### Border Colors

Colors used for borders and dividers:

```typescript
border: '#e1e8ef',         // Standard border color
borderLight: '#f0f4f7',    // Light border color
```

## How to Customize

### Changing Brand Colors

To change your brand colors, simply edit the values in `theme.config.ts`:

```typescript
export const themeConfig = {
  colors: {
    primary: '#YOUR_COLOR_HERE',        // Replace with your brand color
    primaryHover: '#YOUR_HOVER_COLOR',  // Slightly darker shade
    primaryLight: '#YOUR_LIGHT_COLOR',  // Very light shade for backgrounds
    // ... rest of the colors
  }
};
```

### Example: Blue Theme

```typescript
primary: '#2563eb',        // Blue
primaryHover: '#1d4ed8',   // Darker blue
primaryLight: '#dbeafe',   // Light blue
```

### Example: Purple Theme

```typescript
primary: '#9333ea',        // Purple
primaryHover: '#7e22ce',   // Darker purple
primaryLight: '#f3e8ff',   // Light purple
```

## Advanced Customization

### Gradients

Customize gradient effects used in the UI:

```typescript
gradients: {
  avatar: 'linear-gradient(135deg, #3cca70 0%, #2a9d5a 100%)',
  button: 'linear-gradient(135deg, #3cca70 0%, #34b563 100%)',
}
```

### Border Radius

Adjust the roundness of UI elements:

```typescript
borderRadius: {
  sm: '0.375rem',   // Small radius
  md: '0.5rem',     // Medium radius
  lg: '0.75rem',    // Large radius
  full: '9999px',   // Fully rounded (pills, circles)
}
```

### Shadows

Customize shadow depths:

```typescript
shadows: {
  sm: '0 1px 2px 0 rgba(6, 45, 84, 0.05)',
  md: '0 4px 6px -1px rgba(6, 45, 84, 0.1)',
  lg: '0 10px 15px -3px rgba(6, 45, 84, 0.1)',
  xl: '0 20px 25px -5px rgba(6, 45, 84, 0.1)',
}
```

## Using Theme Colors in Your Components

Import the theme config in any component:

```typescript
import { colors } from '../config/theme.config';

// Use in inline styles
<div style={{ color: colors.textPrimary }}>Hello</div>

// Use in dynamic styles
<button
  style={{
    backgroundColor: colors.primary,
    color: '#ffffff'
  }}
>
  Click me
</button>
```

## Helper Functions

### withOpacity

Add opacity to any color:

```typescript
import { withOpacity } from '../config/theme.config';

// Creates rgba color with 50% opacity
const semiTransparent = withOpacity(colors.primary, 0.5);
```

## Best Practices

1. **Consistent Usage**: Always use theme colors instead of hardcoded values
2. **Color Relationships**: Keep color shades harmonious (use online tools like colorhunt.co or coolors.co)
3. **Accessibility**: Ensure sufficient contrast ratios between text and backgrounds
4. **Testing**: Test your theme in both light and dark environments
5. **Documentation**: Document any custom color meanings in your team

## Color Tools

- [Coolors.co](https://coolors.co) - Generate color palettes
- [ColorHunt](https://colorhunt.co) - Browse pre-made palettes
- [Adobe Color](https://color.adobe.com) - Create harmonious color schemes
- [Contrast Checker](https://webaim.org/resources/contrastchecker/) - Verify accessibility

## Current Theme

The template currently uses a green and navy blue theme:

- **Primary (Accent)**: `#3cca70` - Fresh green
- **Text**: `#062d54` and shades - Navy blue
- **Backgrounds**: White and light grays

This creates a professional, modern look suitable for SaaS applications.
