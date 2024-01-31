'use client'

import Card from "client/components/layouts/Card"
import { CommentsData } from "../types/comments.type"
import { forwardRef } from "react"

type CommentsItemType = {
  data: CommentsData
}

const CommentsItem = forwardRef<HTMLElement, CommentsItemType>(
  ({ data }, ref) => {

    const commentItemContent = (
      <div>
        {data.content}
      </div>
    )

    return ref ? (
      <article ref={ref}>
        <Card>
          {commentItemContent}
        </Card>
      </article>
    ) : (
      <article>
        <Card>
          {commentItemContent}
        </Card>
      </article>
    )
  }
)



export default CommentsItem;
