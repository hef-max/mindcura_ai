"use client"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from "@radix-ui/react-separator"
import Image from "next/image"
import Link from "next/link"
import NavItems from "./NavItems"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars } from "@fortawesome/free-solid-svg-icons"

const MobileNav = ({ user }) => {
    return (
        <nav className="flex lg:hidden">
            <Sheet>
                <SheetTrigger className="align-middle">
                    <FontAwesomeIcon icon={faBars} size="xl" />
                </SheetTrigger>
                <SheetContent className="flex flex-col gap-6 bg-white lg:hidden space">
                    <div className="flex w-full justify-between items-start">
                        <Image
                            src="/images/logo.png"
                            alt="Logo"
                            width={50}
                            height={50}
                            className="size-12"
                        />
                        <div className='flex flex-col gap-3 items-center'>
                            <Link href='/account'>
                                <Image
                                    src={user?.myfiles ? user.myfiles : "/icons/user.png"}
                                    alt='logo image'
                                    width={45}
                                    height={45}
                                    priority={true}
                                    className="rounded-full w-[30px] h-[20px] object-cover border-solid"
                                />
                            </Link>
                            <h5 className="font-semibold gap-3">Hi, {user?.username}!</h5>
                        </div>
                    </div>
                    <Separator className="border border-gray-50" />
                    <NavItems />
                </SheetContent>
            </Sheet>
        </nav>
    )
}

export default MobileNav
