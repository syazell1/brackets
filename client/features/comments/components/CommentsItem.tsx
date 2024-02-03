'use client'

import Card from "client/components/layouts/Card"
import { CommentsData } from "../types/comments.type"
import { forwardRef, useContext } from "react"
import styles from './CommentsItem.module.css'
import CommentItemMenu from "./CommentItemMenu"
import { authContextProvider } from "client/providers/AuthContext"

type CommentsItemType = {
  data: CommentsData
}

const CommentsItem = forwardRef<HTMLElement, CommentsItemType>(
  ({ data }, ref) => {
    const { isLoggedIn } = useContext(authContextProvider)
    const commentItemContent = (
      <div className={styles.container}>
        <div>
          {data.content}
        </div>
        {isLoggedIn && <CommentItemMenu />}
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
