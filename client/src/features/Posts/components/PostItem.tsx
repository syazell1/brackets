'use client'

import Card from "@/components/layout/Card"
import { PostDetails } from "../types/Posts"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { forwardRef } from "react"
import Link from "next/link"
import UserHoverCard from "@/features/Users/components/UserHoverCard"
import PostDropDownMenu from "./PostDropDownMenu"

type PostItemType = {
    data: PostDetails
}

const PostItem = forwardRef<HTMLElement, PostItemType>((props : PostItemType, ref) => {
    const { id, title, owner: { username }, content, createdAt } = props.data
    const date = new Date(createdAt).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })

    const postItem = (
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
                                <UserHoverCard username={username} />
                                <p className="text-sm">{date}</p>
                            </div>
                        </div>
                        <div>
                            <PostDropDownMenu id={id}/>
                        </div>
                    </header>
                    <main className="mx-[20px]">
                        <Link href={`posts/${id}`} className="text-2xl font-semibold hover:underline">{title}</Link>
                    </main>

                    <footer>

                    </footer>
                </div>
    )

    const postItemContent = ref ? (
        <article ref={ref}>
            <Card>
                {postItem}
            </Card>
        </article>
    ) : (<article><Card>{postItem}</Card></article>) 

    return postItemContent;
})

PostItem.displayName = "PostItem"

export default PostItem

