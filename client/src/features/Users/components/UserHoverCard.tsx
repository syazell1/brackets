'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { CalendarDays } from "lucide-react";
import { useGetUserDetails } from "../hooks/useGetUserDetails";
import Link from "next/link";


const UserHoverCard = ({username}: {username: string}) => {
    const {data} = useGetUserDetails(username);

    if(!data)
        return <p>Loading...</p>

    const date = new Date().toLocaleDateString("en-us", {month: "long", year: "numeric"})

    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                <p className="text-sm font-semibold hover:underline cursor-pointer">@{data.username}</p>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
                <div className="flex gap-4">
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="">
                        <Link href={`/profile/${data.username}`} className="text-sm font-semibold hover:underline cursor-pointer">
                            @{data.username}
                        </Link>
                        <p className="text-sm">{data.bio}</p>
                        <div className="flex items-center pt-2">
                            <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
                            <span className="text-xs text-muted-foreground">
                                Joined {date} 
                            </span>
                        </div>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    )
}

export default UserHoverCard;