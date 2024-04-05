'use client'

import { CommentsData } from "../types/comments.type"
import { forwardRef, useContext, useState } from "react"
import styles from './CommentsItem.module.css'
import CommentItemMenu from "./CommentItemMenu"
import UpdateCommentForm from "./UpdateCommentForm"
import DeleteCommentConfirmModal from "./DeleteCommentConfirmModal"
import { authContextProvider } from "@/providers/AuthContext"
import Card from "@/components/layouts/Card"

type CommentsItemType = {
  data: CommentsData
}

const CommentsItem = forwardRef<HTMLElement, CommentsItemType>(
  ({ data }, ref) => {
    const { isLoggedIn, usersInfo } = useContext(authContextProvider)
    const [isUpdate, setIsUpdate] = useState(false);
    const [isDelete, setIsDelete] = useState(false);

    const commentItemContent = (
      <>
        {isDelete && <DeleteCommentConfirmModal commentData={data} closeModalHandler={() => setIsDelete(false)} />}
        <div className={!isUpdate ? styles.container : ""}>
          {isUpdate ? (
            <>
              <UpdateCommentForm
                setUpdateCommentHandler={() => setIsUpdate(false)}
                commentData={data} />
            </>
          ) :
            (
              <>
                <div>
                  {data.content}
                </div>
                {(isLoggedIn && data.owner.username == usersInfo.username) &&
                  <CommentItemMenu
                    setUpdateCommentHandler={() => setIsUpdate(true)}
                    setDeleteCommentHandler={() => setIsDelete(true)}
                  />
                }
              </>
            )}
        </div>
      </>
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
