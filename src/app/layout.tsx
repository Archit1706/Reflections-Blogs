import "./globals.css";
import { unstable_getServerSession } from "next-auth/next";
import { getProviders } from "next-auth/react";
import Login from "components/Login";
import Navbar from "components/Navbar";
import Script from "next/script";
import Footer from "components/Footer";
import { Roboto, Ubuntu } from "@next/font/google";
import PageWrapper from "./page-wrapper";

const ubuntu = Ubuntu({
    subsets: ["latin"],
    weight: ["400", "700"],
});

interface Props {
    children: React.ReactNode;
}
export default async function RootLayout({ children }: Props) {
    const session = await unstable_getServerSession();
    const providers = await getProviders();
    console.log(session);

    return (
        <html lang="en" className={ubuntu.className}>
            {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
            <head>
                <title>Reflections</title>
                <link rel="manifest" href="/manifest.json"></link>
            </head>
            <Script src="../path/to/flowbite/dist/flowbite.bundle.js"></Script>
            <body className="wrapper flex flex-col bg-gray-200 dark:bg-zinc-900">
                <div className="fixed w-screen bg-white dark:bg-zinc-900 z-10">
                    <Navbar session={session} />
                </div>
                <PageWrapper>
                    <div>{children}</div>
                </PageWrapper>
            </body>
            <div className="footer">
                <Footer />
            </div>
        </html>
    );
}
