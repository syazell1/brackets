'use client'

import Card from "@/components/layout/Card"
import { useGetUserDetails } from "../hooks/useGetUserDetails";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { authProviderContext } from "@/providers/AuthProvider";

type UserProfileDetailsType = {
    username: string
}

const UserProfileDetails = ({ username }: UserProfileDetailsType) => {
    const { data: userData } = useContext(authProviderContext)
    const { data, isLoading } = useGetUserDetails(username)
    const router = useRouter();

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
                    <div className="flex items-center gap-4">
                        <p className="text-lg font-semibold">@{data.username}</p>
                        {(userData && userData.username === username) && (
                            <Button variant="outline" onClick={() => {
                                router.push(`/profile/${username}/update`)
                            }}>Edit Profile</Button>
                        )}
                    </div>
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