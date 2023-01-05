import Script from "next/script"
// @ts-expect-error no type declarations found
import nightwind from "nightwind/helper"
import { Inter } from "@next/font/google"

import { type AppType } from "next/app"

import { trpc } from "../utils/trpc"

import "../styles/globals.css"

const inter = Inter({ subsets: ["latin"] })

const MyApp: AppType = ({ Component, pageProps }) => {
    return (
        <main className={`${inter.className} bg-white`} style={{ height: "100vh" }}>
            <Script id="nightwindInit" dangerouslySetInnerHTML={{ __html: nightwind.init() }} />
            <Component {...pageProps} />
        </main>
    )
}

export default trpc.withTRPC(MyApp)
0
