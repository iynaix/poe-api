// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultTheme = require("tailwindcss/defaultTheme")

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    // darkMode: "class",
    theme: {
        // bg-white -> bg-base
        // bg-gray-100 -> bg-surface0
        // text-gray-900 -> text-subtext1
        // text-gray-500 -> text-subtext0
        // border-gray-300 -> border-surface0

        // nightwind: {
        //     colorClasses: ["gradient", "ring", "ring-offset", "divide", "placeholder"],
        // },
        extend: {
            fontFamily: {
                sans: ["Inter var", ...defaultTheme.fontFamily.sans],
            },
        },
    },
    plugins: [require("@catppuccin/tailwindcss"), require("@tailwindcss/forms")],
}
