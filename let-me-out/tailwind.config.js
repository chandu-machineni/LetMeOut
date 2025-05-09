/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Enhanced evil theme colors with more nuanced shades
        'villain': {
          100: '#ffd0e0', // Light pink
          200: '#ff80ab', // Medium pink
          300: '#ff4081', // Bright pink
          400: '#c51162', // Deep pink
          500: '#880e4f', // Dark pink
          600: '#560027', // Very dark pink
          700: '#330019', // Almost black with pink tint
          800: '#1a000d', // Nearly black
          900: '#0d0007', // Black with slight pink tint
        },
        'toxic': {
          100: '#d0ffe0', // Light toxic green
          200: '#80ffb8', // Medium toxic green
          300: '#40ff91', // Bright toxic green
          400: '#11c561', // Deep toxic green
          500: '#0e884f', // Dark toxic green
          600: '#025627', // Very dark toxic green
          700: '#013319', // Almost black with green tint
          800: '#001a0d', // Nearly black
          900: '#000d07', // Black with slight green tint
        },
        'glitch': {
          100: '#d0e0ff', // Light glitch blue
          200: '#80abff', // Medium glitch blue
          300: '#4081ff', // Bright glitch blue
          400: '#1162c5', // Deep glitch blue
          500: '#0e4f88', // Dark glitch blue
          600: '#002756', // Very dark glitch blue
          700: '#001933', // Almost black with blue tint
          800: '#000d1a', // Nearly black
          900: '#00070d', // Black with slight blue tint
        },
        'chaos': {
          100: '#ffe0d0', // Light chaos orange
          200: '#ffab80', // Medium chaos orange
          300: '#ff8140', // Bright chaos orange
          400: '#e65100', // Deep chaos orange
          500: '#bf360c', // Dark chaos orange
          600: '#8c2704', // Very dark chaos orange
          700: '#541601', // Almost black with orange tint
          800: '#2c0b01', // Nearly black
          900: '#140600', // Black with slight orange tint
        },
        'serenity': {
          100: '#e6f5ff', // Light serene blue
          200: '#b3e0ff', // Medium serene blue
          300: '#80ccff', // Bright serene blue
          400: '#4da6ff', // Deep serene blue
          500: '#1a80ff', // Dark serene blue
          600: '#0066cc', // Very dark serene blue
          700: '#004d99', // Almost black with blue tint
          800: '#003366', // Nearly black
          900: '#001a33', // Black with slight blue tint
        },
        'corporate': {
          100: '#e6e6e6', // Light corporate gray
          200: '#cccccc', // Medium corporate gray
          300: '#b3b3b3', // Bright corporate gray
          400: '#999999', // Deep corporate gray
          500: '#808080', // Dark corporate gray
          600: '#666666', // Very dark corporate gray
          700: '#4d4d4d', // Almost black with gray tint
          800: '#333333', // Nearly black
          900: '#1a1a1a', // Black with slight gray tint
        },
        'minimal': {
          100: '#ffffff', // Pure white
          200: '#f2f2f2', // Almost white
          300: '#e6e6e6', // Very light gray
          400: '#d9d9d9', // Light gray
          500: '#bfbfbf', // Medium gray
          600: '#8c8c8c', // Dark gray
          700: '#595959', // Very dark gray
          800: '#262626', // Nearly black
          900: '#0d0d0d', // Almost black
        },
        'success': '#ff3d3d', // Red as success (evil UI reversal)
        'error': '#33cc33', // Green as error (evil UI reversal)
        'warning': '#3399ff', // Blue as warning
        'info': '#ffcc00', // Yellow as info
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'serif': ['Playfair Display', 'Georgia', 'serif'],
        'mono': ['Space Mono', 'monospace'],
        'display': ['Space Grotesk', 'sans-serif'],
        'glitch': ['VT323', 'monospace'],
        'evil': ['Creepster', 'cursive'],
        'villain': ['Special Elite', 'cursive'],
        'chaos': ['Fira Code', 'monospace'],
        'serenity': ['Raleway', 'sans-serif'],
        'corporate': ['Roboto', 'sans-serif'],
        'minimal': ['Inter', 'sans-serif'],
      },
      animation: {
        'glitch': 'glitch 1s infinite',
        'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
        'float': 'float 6s ease-in-out infinite',
        'pulse-evil': 'pulseEvil 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'jitter': 'jitter 0.3s ease-in-out infinite',
        'flicker': 'flicker 3s linear infinite',
        'distort': 'distort 5s ease-in-out infinite',
        'glitch-text': 'glitch-text 3s infinite',
        'noise': 'noise 0.2s infinite',
        'spin-slow': 'spin 4s linear infinite',
        'bounce-subtle': 'bounce-subtle 2s infinite',
        'vibrate': 'vibrate 0.2s ease-in-out infinite',
        'hover-grow-shrink': 'hover-grow-shrink 1s ease-in-out infinite',
        'skew-x': 'skew-x 2s ease-in-out infinite',
        'skew-y': 'skew-y 2s ease-in-out infinite',
        'fade-in-out': 'fade-in-out 3s ease-in-out infinite',
      },
      keyframes: {
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-5px, 5px)' },
          '40%': { transform: 'translate(5px, -5px)' },
          '60%': { transform: 'translate(-3px, -3px)' },
          '80%': { transform: 'translate(3px, 3px)' },
        },
        shake: {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(4px, 0, 0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseEvil: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        jitter: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '25%': { transform: 'translate(1px, 1px) rotate(1deg)' },
          '50%': { transform: 'translate(-1px, -1px) rotate(-1deg)' },
          '75%': { transform: 'translate(1px, -1px) rotate(1deg)' },
        },
        flicker: {
          '0%, 100%': { opacity: 1 },
          '41.99%': { opacity: 1 },
          '42%': { opacity: 0.8 },
          '43%': { opacity: 1 },
          '45%': { opacity: 0.3 },
          '46%': { opacity: 1 },
          '50%': { opacity: 0.9 },
          '52%': { opacity: 0.4 },
          '54%': { opacity: 1 },
        },
        distort: {
          '0%, 100%': { transform: 'skew(0deg, 0deg)' },
          '25%': { transform: 'skew(2deg, 1deg)' },
          '50%': { transform: 'skew(-1deg, -2deg)' },
          '75%': { transform: 'skew(1deg, 2deg)' },
        },
        'glitch-text': {
          '0%, 100%': { textShadow: '1px 0 0 red, -1px 0 0 blue' },
          '25%': { textShadow: '-1px 0 0 red, 1px 0 0 blue' },
          '50%': { textShadow: '1px 0 0 red, -1px 0 0 blue' },
          '75%': { textShadow: '-1px 0 0 red, 1px 0 0 blue' },
        },
        noise: {
          '0%, 100%': { backgroundPosition: '0 0' },
          '20%': { backgroundPosition: '20% 20%' },
          '40%': { backgroundPosition: '40% 40%' },
          '60%': { backgroundPosition: '60% 60%' },
          '80%': { backgroundPosition: '80% 80%' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        vibrate: {
          '0%, 100%': { transform: 'translate(0)' },
          '25%': { transform: 'translate(1px, 1px)' },
          '50%': { transform: 'translate(-1px, -1px)' },
          '75%': { transform: 'translate(-1px, 1px)' },
        },
        'hover-grow-shrink': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        'skew-x': {
          '0%, 100%': { transform: 'skewX(0)' },
          '50%': { transform: 'skewX(2deg)' },
        },
        'skew-y': {
          '0%, 100%': { transform: 'skewY(0)' },
          '50%': { transform: 'skewY(1deg)' },
        },
        'fade-in-out': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.6 },
        },
      },
      backgroundImage: {
        'noise-pattern': "url('data:image/png;base64,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')",
        'hero-pattern': "url('data:image/svg+xml;utf8,<svg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'><path d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657l1.415 1.414L13.858 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zm-24.596 0l-5.657 5.657 1.414 1.415L18.972 0h-2.254zm16.972 0l-7.071 7.07-1.414-1.414L33.716 0h-2.254zM21.03 0l-7.071 7.07-1.414-1.415L19.616 0h-2.254zM9.03 0L0 9.03v2.254L11.284 0H9.03zM60 18.286v-2.254L41.97 34.286h2.254L60 18.286zm0 5.657v-2.254L44.143 37.543h2.254l13.603-13.6zM60 29.6v-2.254L46.4 40.8h2.254L60 29.6zm0 5.656v-2.254L48.57 44.03h2.25L60 35.257zM51.83 60l8.17-8.17v-2.254L49.574 60h2.255zM36.743 29.6l-1.414 1.414 12.728 12.728h2.254L36.743 29.6zM41.97 34.828l-1.414 1.414 6.97 6.97h2.25l-7.8-8.384zm-12.812 6.97l-1.414 1.414 5.657 5.657h2.254l-6.5-7.07zm-5.656 5.657l-1.414 1.414 2.829 2.83h2.254l-3.67-4.243zM60 45.657v-2.254l-6.97 6.97 1.414 1.415L60 45.658zM40.557 60l5.657-5.657-1.414-1.414L38.3 60h2.256zm11.313 0l1.414-1.414-1.414-1.414L45.4 60h6.47zM52.87 60l1.415-1.414-1.414-1.414L47.4 60h5.47zM52.87 60l2.83-2.83-1.415-1.414-7.9 7.9 1.414 1.414L52.83 60z' fill='%23000000' fill-opacity='.1' fill-rule='evenodd'/></svg>')",
        'grid-pattern': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        'dot-pattern': "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.2' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E\")",
      },
      boxShadow: {
        'glow': '0 0 15px rgba(255, 255, 255, 0.3)',
        'glow-strong': '0 0 30px rgba(255, 255, 255, 0.5)',
        'inner-glow': 'inset 0 0 15px rgba(255, 255, 255, 0.3)',
        'evil': '0 5px 15px rgba(255, 0, 0, 0.3)',
        'toxic': '0 5px 15px rgba(0, 255, 0, 0.3)',
        'glitch': '0 5px 15px rgba(0, 0, 255, 0.3), 0 -5px 15px rgba(255, 0, 0, 0.3)',
      },
      backgroundSize: {
        'auto': 'auto',
        'cover': 'cover',
        'contain': 'contain',
        '200%': '200%',
        '300%': '300%',
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(5px)',
        'blur-lg': 'blur(15px)',
        'blur-xl': 'blur(25px)',
      },
      screens: {
        'motion-safe': { 'raw': '(prefers-reduced-motion: no-preference)' },
        'motion-reduce': { 'raw': '(prefers-reduced-motion: reduce)' },
      },
      transitionDelay: {
        '0': '0ms',
        '2000': '2000ms',
        '3000': '3000ms',
        '4000': '4000ms',
        '5000': '5000ms',
      },
      transitionProperty: {
        'spacing': 'margin, padding',
        'width': 'width',
        'height': 'height',
        'size': 'width, height',
        'position': 'top, right, bottom, left',
      },
      transitionTimingFunction: {
        'bounce': 'cubic-bezier(0.8, 0, 1, 1)',
        'bounce-out': 'cubic-bezier(0, 0, 0.2, 1)',
        'evil': 'cubic-bezier(0.68, -0.55, 0.27, 1.55)',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      borderWidth: {
        '3': '3px',
        '6': '6px',
        '10': '10px',
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
        '120': '30rem',
      },
      scale: {
        '101': '1.01',
        '102': '1.02',
        '103': '1.03',
      },
      rotate: {
        '1': '1deg',
        '2': '2deg',
        '3': '3deg',
      },
      skew: {
        '1': '1deg',
        '2': '2deg',
        '3': '3deg',
      },
      height: {
        '1/2': '50%',
        '1/3': '33.333333%',
        '2/3': '66.666667%',
        '1/4': '25%',
        '3/4': '75%',
        '1/5': '20%',
        '2/5': '40%',
        '3/5': '60%',
        '4/5': '80%',
        '1/6': '16.666667%',
        '5/6': '83.333333%',
        'screen-1/2': '50vh',
        'screen-1/3': '33.333333vh',
        'screen-2/3': '66.666667vh',
      },
      width: {
        '1/7': '14.2857143%',
        '2/7': '28.5714286%',
        '3/7': '42.8571429%',
        '4/7': '57.1428571%',
        '5/7': '71.4285714%',
        '6/7': '85.7142857%',
      },
    },
  },
  plugins: [],
} 