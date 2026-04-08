// Tailwind v4 uses CSS-first configuration via @theme directive in globals.css
// This file extends the configuration for additional utilities and component variants

import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      // VMS PRO Brand Colors
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        info: {
          DEFAULT: 'hsl(var(--info))',
          foreground: 'hsl(var(--info-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        cta: {
          DEFAULT: 'hsl(var(--accent))',  // CTA uses accent color
          foreground: 'hsl(var(--accent-foreground))',
          light: '#FBB24A',
          dark: '#E85D0A',
        },
        // Professional slate palette for neutral colors
        slate: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },
      },
      // Border radius - Professional scale
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      // Shadows - Subtle, professional
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
      // Base Spacing - Use Tailwind Defaults, but keep custom semantic tokens if needed
      // To avoid clashing with standard tokens (like md, 2xl),
      // we'll remove the redundant and clashing ones.
      spacing: {
        'vms-xs': 'var(--vms-spacing-xs)',
        'vms-sm': 'var(--vms-spacing-sm)',
        'vms-md': 'var(--vms-spacing-md)',
        'vms-lg': 'var(--vms-spacing-lg)',
        'vms-xl': 'var(--vms-spacing-xl)',
        'vms-2xl': 'var(--vms-spacing-2xl)',
      },
      // Animation durations
      transitionDuration: {
        fast: 'var(--duration-fast)',
        normal: 'var(--duration-normal)',
        slow: 'var(--duration-slow)',
      },
      // Custom easing
      transitionTimingFunction: {
        smooth: 'var(--easing-smooth)',
      },
    },
  },
  plugins: [],
};

export default config;
