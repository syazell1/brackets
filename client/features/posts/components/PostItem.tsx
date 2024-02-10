'use client'

import { forwardRef } from "react";
import { PostsDetails } from "../types/posts.types";
import Card from "client/components/layouts/Card";
import styles from './PostItem.module.css'
import { Heart, MessageCircleMore } from "lucide-react";
import PostItemMenu from "./PostItemMenu";
import Link from "next/link";

type PostItemType = {
  data: PostsDetails
}

const PostItem = forwardRef<HTMLElement, PostItemType>(
  ({ data }, ref) => {

    const postItemContent = (
      <div>
        <div className={styles.contents}>
          <div className={styles.title}>
            <h2><Link href={`/posts/${data.id}`}>{data.title}</Link></h2>
            <PostItemMenu data={data} />
          </div>
          <div className={styles.controls}>
            <div className={styles.btn}>
              <Heart />
              <p>{data.likes_count}</p>
            </div>
            <div className={styles.btn}>
              <MessageCircleMore />
              <p>{data.comments_count}</p>
            </div>
          </div>
        </div>
      </div>
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
