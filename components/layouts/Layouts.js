'use client'
import React from 'react';
import { Poppins } from "next/font/google";
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { useAuth } from '@/app/authContext';
import NavItems from '../elements/NavItems';
import MobileNav from '../elements/MobileNav';

const poppins = Poppins({ 
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800", "900"],
    variable: '--font-poppins'
});

const Layout = ({ children }) => {
    const { user, setUser } = useAuth();
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await fetch("https://backend.mindcura.net/api/users", {
                    method: "GET",
                    credentials: 'include'
                });

                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                } else {
                    console.error("Error fetching user data:");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, [setUser]);

    return (
        <main className={`w-screen h-screen select-none ${poppins.className}`}>
            <nav className='fixed w-screen items-center justify-between flex py-4 px-4 md:px-10 shadow bg-white z-50'>
                <Link href='/dashboard'>
                    <Image 
                        src="/images/Group103.png"
                        alt='logo image'
                        width={130}
                        height={130}
                        priority={true}
                        className='w-[190px] h-auto'
                    />
                </Link>
                <nav className="lg:flex hidden w-full justify-center">
                    <NavItems/>
                </nav>
                <div className='flex gap-3'>
                    <MobileNav/>
                    <Link href='/account'>
                        <Image 
                            src={user?.myfiles ? user.myfiles : "/icons/user.png"}
                            alt='logo image'
                            width={45}
                            height={45}
                            priority={true}
                            className="rounded-full w-[50px] h-[40px] object-cover border-solid"
                        />
                    </Link>
                    <h5 className="font-semibold gap-3">Hi, {user?.username}!</h5>
                </div>
            </nav>
            <section className="flex flex-1 pt-[100px] px-4 md:px-10 w-screen h-screen overflow-x-hidden">{children}</section>
        </main>
    )
}

export default Layout;