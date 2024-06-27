'use client'

import { forwardRef, useState } from "react";
import { PostsDetails } from "../types/posts.types";
import { Heart, MessageCircleMore } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import DeletePostDialog from "./DeletePostDialog";
import PostItemMenu from "./PostItemMenu";
import UserPostInfo from "@/features/users/components/UserPostInfo";
import PostLikesButton from "@/features/likes/components/PostLikesButton";

type PostItemType = {
  data: PostsDetails
}

const PostItem = forwardRef<HTMLElement, PostItemType>(
  ({ data }, ref) => {
    const [isDelete, setIsDelete] = useState(false)
    const router = useRouter();


    const postItemContent = (
        <Card>
        <DeletePostDialog isOpen={isDelete} setIsOpen={setIsDelete} postId={data.id} />
        <CardHeader className="flex-row items-center justify-between">
          <UserPostInfo usersInfo={data.owner} createdDate={data.created_at} />
          {/* <PostItemMenu data={data} /> */}
          <PostItemMenu 
            postId={data.id}
            username={data.owner.username} 
            setDeleteCommentHandler={() => setIsDelete(true)}
            />
        </CardHeader>
        <CardContent>
          <CardTitle className="hover:underline">
            <Link href={`/posts/${data.id}`}>{data.title}</Link>
          </CardTitle>
        </CardContent>
        <CardFooter className="flex gap-10">
          <PostLikesButton postId={data.id} likesCount={data.likes_count} isLiked={data.is_liked}  />
          <div className="flex gap-2">
            <MessageCircleMore />
            <p>{data.comments_count}</p>
          </div>
        </CardFooter>
      </Card>
    )

    const postItem = ref ? (
      <article ref={ref}>
          {postItemContent}
      </article>
    ) : (
      <article>
          {postItemContent}
      </article>
    )
    return postItem;
  }
)

PostItem.displayName = "PostItem";

export default PostItem;
