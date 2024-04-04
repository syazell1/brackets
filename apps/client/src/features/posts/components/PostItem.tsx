'use client'

import { forwardRef } from "react";
import { PostsDetails } from "../types/posts.types";
import styles from './PostItem.module.css'
import { Heart, MessageCircleMore } from "lucide-react";
import PostItemMenu from "./PostItemMenu";
import Link from "next/link";
import { Card, CardFooter, CardHeader, CardTitle } from "@repo/ui/components/card";

type PostItemType = {
  data: PostsDetails
}

const PostItem = forwardRef<HTMLElement, PostItemType>(
  ({ data }, ref) => {

    const postItemContent = (
      <>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="hover:underline">
            <Link href={`/posts/${data.id}`}>{data.title}</Link>
          </CardTitle>
          <PostItemMenu data={data} />
        </CardHeader>
        <CardFooter className="gap-8">
          <div className={styles.btn}>
            <Heart />
            <p>{data.likes_count}</p>
          </div>
          <div className={styles.btn}>
            <MessageCircleMore />
            <p>{data.comments_count}</p>
          </div>
        </CardFooter>
      </>
    )

    const postItem = ref ? (
      <article ref={ref}>
        <Card>
          {postItemContent}
        </Card>
      </article>
    ) : (
      <article>
        <Card>
          {postItemContent}
        </Card>
      </article>
    )
    return postItem;
  }
)

PostItem.displayName = "PostItem";

export default PostItem;
