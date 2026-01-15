/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Manrope', 'sans-serif'],
                display: ['Orbitron', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            colors: {
                primary: '#3F51B5',
                secondary: '#E91E63',
                slate: {
                    900: '#020615', // Deep Navy Black
                    800: '#030B24', // Navy
                    700: '#0f172a'
                },
                neon: {
                    blue: '#0072FF',
                    cyan: '#00E0FF',
                    teal: '#00FFC6', // New Cyber Teal
                    purple: '#A970FF',
                    green: '#00FFA3',
                    red: '#FF004E'
                },
                'cyber-teal': {
                    DEFAULT: '#00E0FF',
                    dark: '#0078FF',
                    light: '#00FFC6'
                }
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
                'scan': 'scan 2s linear infinite',
                'spin-slow': 'spin 12s linear infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                scan: {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' }
                }
            }
        },
    },
    plugins: [],
}
