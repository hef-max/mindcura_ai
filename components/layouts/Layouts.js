import React from 'react';
import { Poppins } from "next/font/google";
import Navbar from '../elements/Navbar';


const poppins = Poppins({ 
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800", "900"],
    variable: '--font-poppins'
});

const Layout = ({ children }) => {
    return (
        <main className={`w-screen h-screen select-none ${poppins.className}`}>
            <Navbar/>
            <section className="flex flex-1 mt-[50px] px-4 md:px-10 w-screen h-screen">{children}</section>
        </main>
    )
}

export default Layout;