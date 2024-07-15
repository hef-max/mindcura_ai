"use client";
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { MENU_LIST } from '../layouts/constants';

const NavItems = () => {
    const pathname = usePathname();
    const router = useRouter()
    const handleChangePage = (path) => {
        router.push(path)
    }

    return (
        <ul className='lg:flex-row flex w-full flex-col items-start lg:justify-center gap-4'>
            {MENU_LIST.map((menu, index) => (
                <li 
                key={index}
                className={`font-medium text-md select-none hover:text-black ${pathname === menu.path ? "text-black cursor-default" : "text-grey-500 cursor-pointer"}`} 
                onClick={() => handleChangePage(menu.path)}
                >
                    {menu.name}
                </li>
            ))}
        </ul>
    )
}

export default NavItems
