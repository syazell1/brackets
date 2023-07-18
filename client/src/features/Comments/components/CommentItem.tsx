import Card from "@/components/layout/Card";
import { CommentDetails } from "../types/Comments"
import { forwardRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UserHoverCard from "@/features/Users/components/UserHoverCard";
import PostDropDownMenu from "@/features/Posts/components/PostDropDownMenu";
import Link from "next/link";
import CommentDropDownMenu from "./CommentDropDownMenu";

type CommentItemType = {
    data: CommentDetails
}

const CommentItem = forwardRef<HTMLElement, CommentItemType>((props: CommentItemType, ref) => {
    const { id, content, owner: { username }, createdAt } = props.data
    const date = new Date(createdAt).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })

    const commentItem = (
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
                    <CommentDropDownMenu id={id} />
                </div>
            </header>
            <main className="mx-[20px]">
                <p>{content}</p> 
            </main>

            <footer>

            </footer>
        </div>
    )

    const commentItemContent = ref ? (
        <article ref={ref}>
            <Card>
                {commentItem}
            </Card>
        </article>
    ) : (<article><Card>{commentItem}</Card></article>)

    return commentItemContent;
})

CommentItem.displayName = "CommentItem"

export default CommentItem;