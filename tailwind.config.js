/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Base palette — extracted verbatim from auxia.io CSS variables
        blue:        { DEFAULT: '#0b4fff', dark: '#080331', light: '#d8dade' },
        orange:      '#fa6838',
        pink:        { dark: '#3c043b', light: '#ffaefe' },
        ink:         { DEFAULT: '#232323', dark: '#444', darker: '#222', darkest: '#111', neutral: '#666' },
        oat:         { DEFAULT: '#c3c2b2', dark: '#e2e1d3', darkest: '#c3c2b2' },
        paper:       '#f0efe3',
      // Measured on the live original: .layout48_component and .splide__slide
      // (case-studies cards) sit on #fefdf5 — a warmer, lighter tint than paper.
      cream:       '#fefdf5',
        focus:       '#2d62ff',
        success:     { DEFAULT: '#cef5ca', dark: '#114e0b' },
        warning:     { DEFAULT: '#fcf8d8', dark: '#5e5515' },
        error:       { DEFAULT: '#f8e4e4', dark: '#3b0b0b' },
      },
      fontFamily: {
        // Display face. Original uses PP Neue Montreal (commercial, Pangram Pangram).
        // Archivo (SIL OFL) is the closest free match: measured 3.69% mean advance-width
        // deviation from PP Neue Montreal across a 7-string sample, worst case 5.21% —
        // the best of 10 grotesques tested. Swap this token if you hold the licence.
        sans: ['Archivo', 'Arial', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        large:  '77rem',
        medium: '64rem',
        small:  '48rem',
        nav:    '90rem',
      },
      borderRadius: { btn: '.75rem' },
      fontSize: {
        // Body scale: the original runs a flat 1.3 line-height ratio
        // (16->20.8, 18->23.4, 20->26, 24->31.2). Tailwind's defaults are
        // 1.5/1.75/1.4 and were overriding the base rule.
        'sm':   ['.875rem', { lineHeight: '1.3' }],
        'base': ['1rem',    { lineHeight: '1.3' }],
        'lg':   ['1.125rem',{ lineHeight: '1.3' }],
        'xl':   ['1.25rem', { lineHeight: '1.3' }],
        '2xl':  ['1.5rem',  { lineHeight: '1.3' }],
        // Real scale from the original's .heading-style-* utilities
        'h1': ['6.5rem', { lineHeight: '.95', letterSpacing: '-.03em', fontWeight: '500' }],
        'h2': ['4rem',   { lineHeight: '.95', letterSpacing: '-.03em', fontWeight: '500' }],
        'h3': ['3rem',   { lineHeight: '.95', letterSpacing: '-.03em', fontWeight: '500' }],
        'h4': ['4rem',   { lineHeight: '.95', letterSpacing: '-.03em', fontWeight: '500' }],
        'h5': ['1.25rem',{ lineHeight: '1.1', fontWeight: '500' }],
      },
    },
  },
  plugins: [],
}
