// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultTheme = require("tailwindcss/defaultTheme")

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    // darkMode: "class",
    theme: {
        nightwind: {
            colorClasses: ["gradient", "ring", "ring-offset", "divide", "placeholder"],
        },
        extend: {
            fontFamily: {
                sans: ["Inter var", ...defaultTheme.fontFamily.sans],
            },
        },
    },
    plugins: [
        // require("nightwind"),
        require("@tailwindcss/forms"),
    ],
}
