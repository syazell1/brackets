'use client'

import Card from "@/components/layout/Card"
import { useGetPostById } from "../hooks/useGetPostById";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UserHoverCard from "@/features/Users/components/UserHoverCard";
import PostDropDownMenu from "./PostDropDownMenu";
import LikePost from "./LikePost";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PostDetails } from "../types/Posts";


type PostDetailsType = {
    data: PostDetails 
}

const PostDetails = ({ data }: PostDetailsType) => {
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
                        <PostDropDownMenu id={data.id} ownerName={data.owner.username} />
                    </div>
                </header>
                <main className="mx-[20px]">
                    <div >
                        <h2 className="text-2xl font-semibold">{data.title}</h2>
                        <div  className="markdown-body" style={{marginTop: "30px"}}>
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {data.content}
                            </ReactMarkdown>
                        </div>
                    </div>
                </main>

                <footer className="mx-[20px] mt-[30px]">
                    <div className="flex gap-4">
                        <div className="flex gap-2 items-center">
                            <LikePost postId={data.id} likesCount={data.likeCount} />
                        </div>
                    </div>
                </footer>
            </div>
        </Card>
    )
}

export default PostDetails;