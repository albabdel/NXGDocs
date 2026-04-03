/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{js,jsx,ts,tsx,md,mdx}',
    ],
    darkMode: ['class', '[data-theme="dark"]'],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3B82F6',
                    600: '#2563EB',
                    700: '#1D4ED8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                },
            },
            typography: (theme) => ({
                DEFAULT: {
                    css: {
                        maxWidth: 'none',
                        color: theme('colors.gray.700'),
                        a: {
                            color: theme('colors.primary.600'),
                            textDecoration: 'none',
                            fontWeight: '500',
                            '&:hover': {
                                color: theme('colors.primary.700'),
                                textDecoration: 'underline',
                            },
                        },
                        'code::before': { content: '""' },
                        'code::after': { content: '""' },
                        code: {
                            backgroundColor: theme('colors.gray.100'),
                            padding: '0.25rem 0.4rem',
                            borderRadius: '0.25rem',
                            fontWeight: '400',
                        },
                    },
                },
                dark: {
                    css: {
                        color: theme('colors.gray.300'),
                        a: {
                            color: theme('colors.primary.400'),
                            '&:hover': { color: theme('colors.primary.300') },
                        },
                        code: { backgroundColor: theme('colors.gray.800') },
                    },
                },
            }),
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
        require('@tailwindcss/forms'),
    ],
};
