// Tailwind v4 uses CSS-first configuration via @theme directive in globals.css
// This file extends the configuration for additional utilities and component variants

import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      // Notion Color Palette
      colors: {
        notion: {
          black: 'rgba(0, 0, 0, 0.95)',
          white: '#ffffff',
          blue: '#0075de',
          'active-blue': '#005bab',
          'focus-blue': '#097fe8',
          'badge-blue-bg': '#f2f9ff',
          'badge-blue-text': '#097fe8',
        },
        // Warm Neutral Scale - Yellow-Brown Undertones
        warm: {
          white: '#f6f5f4',
          dark: '#31302e',
          gray: {
            500: '#615d59',
            300: '#a39e98',
          }
        },
        // Semantic Colors
        semantic: {
          teal: '#2a9d99',
          green: '#1aae39',
          orange: '#dd5b00',
          pink: '#ff64c8',
          purple: '#391c57',
          brown: '#523410',
        },
        // Legacy VMS colors (for compatibility)
        background: 'rgba(255, 255, 255, 1)',
        foreground: 'rgba(0, 0, 0, 0.95)',
        card: {
          DEFAULT: '#ffffff',
          foreground: 'rgba(0, 0, 0, 0.95)',
        },
        popover: {
          DEFAULT: '#ffffff',
          foreground: 'rgba(0, 0, 0, 0.95)',
        },
        secondary: {
          DEFAULT: 'rgba(0, 0, 0, 0.05)',
          foreground: 'rgba(0, 0, 0, 0.95)',
        },
        muted: {
          DEFAULT: 'rgba(0, 0, 0, 0.05)',
          foreground: '#615d59',
        },
        'muted-foreground': '#615d59',
        accent: {
          DEFAULT: '#0075de',
          foreground: '#ffffff',
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff',
        },
        border: 'rgba(0, 0, 0, 0.1)',
        input: '#dddddd',
        ring: '#097fe8',
        primary: {
          DEFAULT: '#0075de',
          foreground: '#ffffff',
        },
        success: '#1aae39',
        warning: '#dd5b00',
        info: '#0075de',
      },
      // Notion Border Radius Scale
      borderRadius: {
        micro: '4px',
        subtle: '5px',
        standard: '8px',
        comfortable: '12px',
        large: '16px',
        pill: '9999px',
        circle: '100%',
      },
      // Notion Shadow System - Multi-layer whisper stacks
      boxShadow: {
        'notion-card': 'rgba(0, 0, 0, 0.04) 0px 4px 18px, rgba(0, 0, 0, 0.027) 0px 2.025px 7.84688px, rgba(0, 0, 0, 0.02) 0px 0.8px 2.925px, rgba(0, 0, 0, 0.01) 0px 0.175px 1.04062px',
        'notion-deep': 'rgba(0, 0, 0, 0.01) 0px 1px 3px, rgba(0, 0, 0, 0.02) 0px 3px 7px, rgba(0, 0, 0, 0.02) 0px 7px 15px, rgba(0, 0, 0, 0.04) 0px 14px 28px, rgba(0, 0, 0, 0.05) 0px 23px 52px',
        'notion-focus': '0 0 0 2px #097fe8',
      },
      // Notion Spacing Scale - 8px base unit
      spacing: {
        '1': '2px',
        '2': '3px',
        '3': '4px',
        '4': '5px',
        '5': '6px',
        '6': '7px',
        '7': '8px',
        '8': '11px',
        '9': '12px',
        '10': '14px',
        '11': '16px',
        '12': '24px',
        '13': '32px',
      },
      // Animation Durations
      transitionDuration: {
        fast: '150ms',
        normal: '200ms',
        slow: '300ms',
      },
      // Custom easing
      transitionTimingFunction: {
        'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
        'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
      },
      // Letter spacing for Notion typography
      letterSpacing: {
        'display-hero': '-2.125px',
        'display-secondary': '-1.875px',
        'section-heading': '-1.5px',
        'sub-heading': '-0.625px',
        'card-title': '-0.25px',
        'body-large': '-0.125px',
        'badge': '0.125px',
      },
      // Font sizes for Notion typography
      fontSize: {
        'display-hero': ['4rem', { lineHeight: '1', letterSpacing: '-2.125px', fontWeight: '700' }],
        'display-secondary': ['3.375rem', { lineHeight: '1.04', letterSpacing: '-1.875px', fontWeight: '700' }],
        'section-heading': ['3rem', { lineHeight: '1', letterSpacing: '-1.5px', fontWeight: '700' }],
        'sub-heading-large': ['2.5rem', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '700' }],
        'sub-heading': ['1.625rem', { lineHeight: '1.23', letterSpacing: '-0.625px', fontWeight: '700' }],
        'card-title': ['1.375rem', { lineHeight: '1.27', letterSpacing: '-0.25px', fontWeight: '700' }],
        'body-large': ['1.25rem', { lineHeight: '1.4', letterSpacing: '-0.125px', fontWeight: '600' }],
        'body': ['1rem', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '400' }],
        'body-medium': ['1rem', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '500' }],
        'body-semibold': ['1rem', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '600' }],
        'body-bold': ['1rem', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '700' }],
        'nav': ['0.9375rem', { lineHeight: '1.33', letterSpacing: '0', fontWeight: '600' }],
        'caption': ['0.875rem', { lineHeight: '1.43', letterSpacing: '0', fontWeight: '500' }],
        'caption-light': ['0.875rem', { lineHeight: '1.43', letterSpacing: '0', fontWeight: '400' }],
        'badge': ['0.75rem', { lineHeight: '1.33', letterSpacing: '0.125px', fontWeight: '600' }],
        'micro': ['0.75rem', { lineHeight: '1.33', letterSpacing: '0.125px', fontWeight: '400' }],
      },
    },
  },
  plugins: [],
};

export default config;
