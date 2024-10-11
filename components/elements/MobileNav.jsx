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
                <SheetContent className="flex flex-col gap-4 bg-white lg:hidden space">
                    <div className='flex items-center gap-5 mt-5'>
                        <Link href='/account'>
                            <Image
                                src={user?.myfiles ? user.myfiles : "/icons/user.png"}
                                alt='logo image'
                                width={45}
                                height={45}
                                priority={true}
                                className="rounded-full sized-10 object-cover border-solid"
                            />
                        </Link>
                        <h5 className="font-semibold gap-3 text-md">Hi,<br/>{user?.username}!</h5>
                    </div>
                    <Separator className="border border-gray-50" />
                    <NavItems />
                </SheetContent>
            </Sheet>
        </nav>
    )
}

export default MobileNav
