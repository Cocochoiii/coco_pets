/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // 主色调 - 优雅的奶油粉色系
                primary: {
                    DEFAULT: "#D4A5A5",  // 柔和的玫瑰奶茶色
                    50: "#FDFCFB",
                    100: "#FAF7F5",
                    200: "#F5EDE8",
                    300: "#EEE1DB",  // 主要的浅奶油粉色
                    400: "#E6D0C7",
                    500: "#D4A5A5",  // 中度玫瑰奶茶色
                    600: "#C08B8B",
                    700: "#A67373",  // 深玫瑰褐色
                    800: "#8B5E5E",
                    900: "#704949",
                    950: "#553636"
                },
                // 中性色 - 温暖的灰褐色系
                neutral: {
                    DEFAULT: "#8B7E78",
                    50: "#FAFAF9",
                    100: "#F5F4F3",
                    150: "#EFEDEB",
                    200: "#E8E5E2",
                    300: "#D6D2CE",
                    400: "#B0A9A4",
                    500: "#8B7E78",
                    600: "#6B5D57",
                    700: "#524641",
                    800: "#3A3330",
                    900: "#2A2522",
                    950: "#1A1614"
                },
                // 功能色 - 柔和配色
                success: "#7A9A82",
                warning: "#D4A574",
                error: "#C17B7B",
                info: "#8FA5B8",
                // 背景和边框
                background: {
                    DEFAULT: "#FFFFFF",
                    secondary: "#FAFAF9",
                    tertiary: "#F5F4F3"
                },
                border: {
                    DEFAULT: "#E8E5E2",
                    light: "#F5F4F3",
                    dark: "#D6D2CE"
                }
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
                display: ["Poppins", "system-ui", "sans-serif"],
            },
            fontSize: {
                'xs': ['0.75rem', { lineHeight: '1rem' }],
                'sm': ['0.875rem', { lineHeight: '1.25rem' }],
                'base': ['1rem', { lineHeight: '1.5rem' }],
                'lg': ['1.125rem', { lineHeight: '1.75rem' }],
                'xl': ['1.25rem', { lineHeight: '1.75rem' }],
                '2xl': ['1.5rem', { lineHeight: '2rem' }],
                '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
                '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
                '5xl': ['3rem', { lineHeight: '1.16' }],
                '6xl': ['3.75rem', { lineHeight: '1.16' }],
            },
            animation: {
                "fade-in": "fadeIn 0.5s ease-in-out",
                "fade-up": "fadeUp 0.5s ease-out",
                "fade-down": "fadeDown 0.5s ease-out",
                "slide-in-right": "slideInRight 0.5s ease-out",
                "scale-up": "scaleUp 0.3s ease-out",
                "float": "float 6s ease-in-out infinite",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                fadeUp: {
                    "0%": { opacity: "0", transform: "translateY(10px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                fadeDown: {
                    "0%": { opacity: "0", transform: "translateY(-10px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                slideInRight: {
                    "0%": { opacity: "0", transform: "translateX(-20px)" },
                    "100%": { opacity: "1", transform: "translateX(0)" },
                },
                scaleUp: {
                    "0%": { opacity: "0", transform: "scale(0.95)" },
                    "100%": { opacity: "1", transform: "scale(1)" },
                },
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-10px)" },
                }
            },
            boxShadow: {
                'soft-xs': '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
                'soft-sm': '0 1px 3px 0 rgba(0, 0, 0, 0.04)',
                'soft': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                'soft-md': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                'soft-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
                'soft-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
                'soft-2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.03)',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'subtle-gradient': 'linear-gradient(135deg, #EEE1DB 0%, #D4A5A5 100%)',
            },
        },
    },
    plugins: [],
}