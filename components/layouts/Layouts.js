import React from 'react';
import { Poppins } from "next/font/google";
import Navbar from '../elements/Navbar';
import usePath from '@/hooks/usePath';


const poppins = Poppins({ 
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800", "900"],
    variable: '--font-poppins'
});

const Layout = ({ children, path=null }) => {
    // console.log(path);
    return (
        <main className={`w-full select-none overflow-y-auto ${poppins.className}`}>
            <Navbar/>
            <section className={`flex flex-col ${path !== 'avatar' ? 'pt-[50px] px-4 md:px-10' : null} w-full h-full`}>{children}</section>
        </main>
    )
}

export default Layout;