/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    redirects() {
        return [
            {
                source: "/",
                destination: "/api/graphql",
                permanent: true,
            },
        ]
    },
}

module.exports = nextConfig
