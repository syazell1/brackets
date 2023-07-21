'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { UserInfo } from "../types/Users";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/features/Auth/hooks/useLogout";
import Link from "next/link";

type UserMenuType = {
    data: UserInfo
}

const UserMenu = ({ data: { username } }: UserMenuType) => {
    const {mutate, isLoading} = useLogout();
    
    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <div>
                        <h2 className="px-4 py-2 font-semibold text-sm bg-violet-500 text-white rounded-md shadow-sm hover:scale-125 ease-in-out duration-700">@{username}</h2>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">
                        <Link href={`/profile/${username}`}>Profile</Link> 
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer" onClick={() => {mutate()}}>
                        {isLoading ? "Loading..." : "Logout"}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

export default UserMenu;