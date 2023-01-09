import { Inter } from "@next/font/google"

import { type AppType } from "next/app"

import { trpc } from "../utils/trpc"

import "../styles/globals.css"

const inter = Inter({ subsets: ["latin"] })

const MyApp: AppType = ({ Component, pageProps }) => {
    return (
        <main className={inter.className} style={{ height: "100vh" }}>
            <Component {...pageProps} />
        </main>
    )
}

export default trpc.withTRPC(MyApp)
0
