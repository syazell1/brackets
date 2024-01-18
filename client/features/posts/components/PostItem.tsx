'use client'

import { forwardRef } from "react";
import { PostsDetails } from "../types/posts.types";
import Card from "client/components/layouts/Card";

type PostItemType = {
  data: PostsDetails
}

const PostItem = forwardRef<HTMLElement, PostItemType>(
  ({ data }, ref) => {

    const postItemContent = (
      <p>{data.title}</p>
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
