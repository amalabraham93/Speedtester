/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#3F51B5',
                secondary: '#E91E63',
                slate: {
                    900: '#0f172a',
                    800: '#1e293b'
                },
                neon: {
                    blue: '#2f80ed',
                    cyan: '#00f2fe',
                    purple: '#bd00ff'
                },
                dark: '#1a1a1a',
                light: '#f5f5f5'
            }
        },
    },
    plugins: [],
}
