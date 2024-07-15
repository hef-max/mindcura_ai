"use client"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
  } from "@/components/ui/sheet"
import { Separator } from "@radix-ui/react-separator"
import Image from "next/image"
import NavItems from "./NavItems"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars } from "@fortawesome/free-solid-svg-icons"
  
const MobileNav = () => {
    return (
        <nav className="flex lg:hidden">
            <Sheet>
                <SheetTrigger className="align-middle">
                    <FontAwesomeIcon icon={faBars} size="lg"/>
                </SheetTrigger>
                <SheetContent className="flex flex-col gap-6 bg-white lg:hidden">
                    <Image
                        src="/images/logo.png"
                        alt="Logo"
                        width={50}
                        height={50}
                    />
                    <Separator className="border border-gray-50"/>
                    <NavItems/>
                </SheetContent>
            </Sheet>
        </nav>
    )
}

export default MobileNav
