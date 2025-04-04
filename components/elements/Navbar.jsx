'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/app/authContext';
import NavItems from './NavItems';
import MobileNav from './MobileNav';


const Navbar = () => {
  const { user, setUser } = useAuth();
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`, {
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
    <nav className='w-full items-center justify-between flex py-3 lg:py-2 px-4 md:px-10 shadow bg-white'>
      <Link href='/dashboard'>
        <Image
          src="/images/Group103.png"
          alt='logo image'
          width={601}
          height={208}
          priority={true}
          className='w-72 lg:w-52 h-auto'
        />
      </Link>
      <div className="lg:flex hidden w-full justify-center items-center">
        <NavItems />
        <div className='flex gap-3'>
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
      </div>
      <div className="flex justify-end lg:hidden w-full px-4">
        <MobileNav user={user}/>
      </div>
    </nav>
  )
}

export default Navbar