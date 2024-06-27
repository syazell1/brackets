import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { CalendarDays } from "lucide-react";
import { UsersInfo } from "../types/users.types";
import { Button } from "@/components/ui/button";
import UserAvatar from "./UserAvatar";
import Link from "next/link";
import { authStore } from "@/providers/AuthStore";
import FollowButton from "@/features/follows/components/FollowButton";

type UserHoverCardProp = {
    usersInfo: UsersInfo
}

const UserHoverCard = ({usersInfo : {username, id}} : UserHoverCardProp) => {
    const {isLoggedIn, authInfo : {id : loggedInUserId}} = authStore();

    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                <Button variant="link" className="p-0 h-0 font-semibold">@{username}</Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
                <div className="flex justify-between space-x-4">
                    <UserAvatar /> 
                    <div className="space-y-1">
                        <Button variant="link" className="p-0 h-0 font-semibold" asChild>
                            <Link href={`/profile/${username}`}>@{username}</Link>
                        </Button>
                        <p className="text-sm">
                            The React Framework – created and maintained by @vercel.
                        </p>
                        <div className="flex items-center pt-2">
                            <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
                            <span className="text-xs text-muted-foreground">
                                Joined December 2021
                            </span>
                        </div>
                        {isLoggedIn && id !== loggedInUserId && (
                            <div className="flex items-center pt-2">
                                <FollowButton userId={id}/>
                            </div>
                        )}
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    )
}

export default UserHoverCard;