/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{js,jsx,ts,tsx,md,mdx}',
        './docs/**/*.{md,mdx}',
        './blog/**/*.{md,mdx}',
    ],
    darkMode: ['class', '[data-theme="dark"]'],
    theme: {
        extend: {
            colors: {
                // NXGEN Brand Colors - Luxury Dark Theme (Gold/Amber)
                primary: {
                    50: '#fef9e7',
                    100: '#fef3c7',
                    200: '#fde68a',
                    300: '#fcd34d',
                    400: '#fbbf24',
                    500: '#E8B058', // Main brand color - Golden Amber
                    600: '#D4A047',
                    700: '#C09036',
                    800: '#AC8025',
                    900: '#987014',
                },
                secondary: {
                    50: '#f5f3ff',
                    100: '#ede9fe',
                    200: '#ddd6fe',
                    300: '#c4b5fd',
                    400: '#a78bfa',
                    500: '#8b5cf6',
                    600: '#7c3aed',
                    700: '#6d28d9',
                    800: '#5b21b6',
                    900: '#4c1d95',
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
                        'code::before': {
                            content: '""',
                        },
                        'code::after': {
                            content: '""',
                        },
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
                            '&:hover': {
                                color: theme('colors.primary.300'),
                            },
                        },
                        code: {
                            backgroundColor: theme('colors.gray.800'),
                        },
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
