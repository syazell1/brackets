'use client'

import Card from "@/components/layout/Card"
import CommentDropDownMenu from "./CommentDropDownMenu";
import { useGetCommentById } from "../hooks/useGetCommentById";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UserHoverCard from "@/features/Users/components/UserHoverCard";
import PostCommentDetails from "./PostCommentDetails";

type CommentDetailsType = {
    commentId : string
}

const CommentDetails = ({commentId} : CommentDetailsType) => {
    const { data, isLoading } = useGetCommentById(commentId);
    
    if (!data)
        return <p>Loading...</p>
    
    const date = new Date(data.createdAt).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })

    return (
       <>
       <PostCommentDetails data={data.post} />
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
                        <CommentDropDownMenu />
                    </div>
                </header>
                <main className="mx-[20px]">
                    <div className="flex flex-col gap-4">
                        <p>{data.content}</p>
                    </div> 
                </main>

                <footer>

                </footer>
            </div>
        </Card>
       </> 
    )
}

export default CommentDetails;