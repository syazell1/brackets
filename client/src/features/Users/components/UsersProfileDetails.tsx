'use client'

import Card from "@/components/layout/Card"
import { useGetUserDetails } from "../hooks/useGetUserDetails";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

type UserProfileDetailsType = {
    username: string
}

const UserProfileDetails = ({ username }: UserProfileDetailsType) => {
    const { data, isLoading } = useGetUserDetails(username)

    if (!data || isLoading)
        return <p>Loading...</p>

    return (
        <Card>
            <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-4 items-center">
                    <Avatar className="w-[100px] h-[100px]">
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <p className="text-lg font-semibold">@{data.username}</p>
                </div>
                {/* Users Info */}
                <div className="mx-auto w-[250px]">
                    <div>
                         <Label htmlFor="terms">Bio</Label>
                        <p className="italic">{data.bio}</p>
                    </div> 
                </div>
            </div>
        </Card>
    )
}

export default UserProfileDetails;