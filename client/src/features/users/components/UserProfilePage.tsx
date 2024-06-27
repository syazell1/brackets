'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import UsersPostList from "@/features/posts/components/UsersPostList";
import { UserDetails } from "../types/users.types";

const UserProfilePage = ({ data }: { data: UserDetails}) => {
    return (
        <div className="space-y-6">
            <Card className="flex items-center justify-center flex-col gap-8 p-8">
                <Avatar className="h-[128px] w-[128px] border border-black">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="space-y-2 text-center">
                    <h2 className="font-semibold text-2xl">@{data.username}</h2>
                    <p>{data.bio !== null && data.bio.length > 0 && data.bio}</p>
                </div>
            </Card>
            <div className="space-y-4">
                <h2 className="font-semibold text-lg">Recent Posts</h2>
                <UsersPostList username={data.username} />
            </div>
        </div>
    )
}

export default UserProfilePage;