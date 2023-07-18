'use client'

import Card from "@/components/layout/Card"
import { useGetPostById } from "../hooks/useGetPostById";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import UserHoverCard from "@/features/Users/components/UserHoverCard";
import PostDropDownMenu from "./PostDropDownMenu";

type PostDetailsType = {
    id: string
}

const PostDetails = ({ id }: PostDetailsType) => {
    const { data, isLoading } = useGetPostById(id);
    
    if (!data)
    return <p>Loading...</p>
    
    const date = new Date(data.createdAt).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })

    return (
        <Card>
            <div className="flex flex-col gap-4">
                <header className="flex justify-between">
                    <div className="flex gap-2 items-center">
                        <div>
                            <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </div>
                        <div>
                            <UserHoverCard username={data.owner.username} />
                            <p className="text-sm">{date}</p>
                        </div>
                    </div>
                    <div>
                        <PostDropDownMenu />
                    </div>
                </header>
                <main className="mx-[20px]">
                    <div className="flex flex-col gap-4">
                        <h2 className="text-2xl font-semibold">{data.title}</h2>
                        <p>{data.content}</p>
                    </div> 
                </main>

                <footer>

                </footer>
            </div>
        </Card>
    )
}

export default PostDetails;