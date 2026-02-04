/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', 'sans-serif'],
            },
            colors: {
                // We will rely on Tailwind's Slate and Blue/Sky palette for now, 
                // using utility classes to compose the medical look.
            }
        },
    },
    plugins: [],
}
