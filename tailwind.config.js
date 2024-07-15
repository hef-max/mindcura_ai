/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic':
                'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
            colors: {
                primary: {
                950: '#172554',
                900: '#1E398A',
                800: '#1F3FAE',
                700: '#1E4DD7',
                600: '#2662EA',
                500: '#3C81F5',
                400: '#61A4F9',
                200: '#BFDBFE',
                100: '#DBEAFE',
                50: ' #EFF6FF',
                foreground: 'hsl(var(--primary-foreground))',
                },
                grey: {
                600: '#545454', // Subdued - color name in figma
                500: '#757575',
                400: '#AFAFAF', // Disabled - color name in figma
                50: '#F6F6F6', // White Grey - color name in figma
                },
                danger: "#FF0F0F",
                warning: "#F9AA33",
                success: "#14A44D",
                black: '#000000',
                white: '#FFFFFF',
                whatsapp: '#25D366',
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                foreground: 'hsl(var(--foreground))',
                secondary: {
                DEFAULT: 'hsl(var(--secondary))',
                foreground: 'hsl(var(--secondary-foreground))',
                },
                destructive: {
                DEFAULT: 'hsl(var(--destructive))',
                foreground: 'hsl(var(--destructive-foreground))',
                },
                muted: {
                DEFAULT: 'hsl(var(--muted))',
                foreground: 'hsl(var(--muted-foreground))',
                },
                accent: {
                DEFAULT: 'hsl(var(--accent))',
                foreground: 'hsl(var(--accent-foreground))',
                },
                popover: {
                DEFAULT: 'hsl(var(--popover))',
                foreground: 'hsl(var(--popover-foreground))',
                },
                card: {
                DEFAULT: 'hsl(var(--card))',
                foreground: 'hsl(var(--card-foreground))',
                },
            },
            fontFamily: {
                sans: ["Inter", "sans-serif"],
            },
        },
    },
    plugins: [require('tailwindcss-animate')],
}
