'use client'

import Card from "@/components/layout/Card"
import { PostDetails } from "../types/Posts"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CalendarDays, MoreVertical } from "lucide-react"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { forwardRef } from "react"
import Link from "next/link"

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
                                <HoverCard>
                                    <HoverCardTrigger asChild>
                                        {/* <Button variant="link">@nextjs</Button> */}
                                        <p className="text-sm font-semibold hover:underline cursor-pointer">@{username}</p>
                                    </HoverCardTrigger>
                                    <HoverCardContent className="w-80">
                                        <div className="flex gap-4">
                                            <Avatar>
                                              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                              <AvatarFallback>CN</AvatarFallback>
                                            </Avatar>
                                            <div className="">
                                                <h4 className="text-sm font-semibold">@{username}</h4>
                                                <p className="text-sm">
                                                    Some bio can be inserted in here
                                                </p>
                                                <div className="flex items-center pt-2">
                                                    <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
                                                    <span className="text-xs text-muted-foreground">
                                                        Joined December 2021
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </HoverCardContent>
                                </HoverCard>
                                <p className="text-sm">{date}</p>
                            </div>
                        </div>
                        <div>
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <div>
                                        <MoreVertical size={25} />
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>Post Menu</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="cursor-pointer" >Copy Post Link</DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer">Update Post</DropdownMenuItem>
                                    {/* <DropdownMenuItem className="cursor-pointer" onClick={deletePostHandler} >Delete Post</DropdownMenuItem> */}
                                </DropdownMenuContent>
                            </DropdownMenu>
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


export default PostItem

