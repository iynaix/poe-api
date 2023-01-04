// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env/server.mjs"))

/** @type {import("next").NextConfig} */
const config = {
    reactStrictMode: true,
    swcMinify: true,
    // for poe images
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "web.poecdn.com",
            },
        ],
    },
    redirects: async () => {
        return [
            {
                source: "/",
                destination: "/api/graphql",
                permanent: false,
                locale: false,
            },
        ]
    },
}
export default config
