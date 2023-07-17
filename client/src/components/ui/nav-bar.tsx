'use client'

import UserNavMenu from "@/features/Users/components/UserNavMenu"
import { Input } from "./input"
import Link from "next/link"

const NavBar = () => {
    return (
        <header className="bg-white px-4 p-2 shadow-md fixed w-full z-50">
            <nav className="flex justify-between items-center gap-4">
                <Link href="/" className="text-lg font-semibold hover:underline">brackets</Link>
                <div className="basis-[350px]">
                    <Input placeholder="Search" />
                </div>
                <UserNavMenu />
            </nav>
        </header>
    )
}

export default NavBar