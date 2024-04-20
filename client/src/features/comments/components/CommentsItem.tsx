'use client'

import { CommentsData } from "../types/comments.type"
import { forwardRef, useContext, useState } from "react"
import UpdateCommentForm from "./UpdateCommentForm"
import { authContextProvider } from "@/providers/AuthContext"
import { Card } from "@/components/ui/card"
import remarkGfm from 'remark-gfm'
import ReactMarkdown from 'react-markdown'
import CommentItemMenu from "./CommentItemMenu"
import DeleteCommentDialog from "./DeleteCommentDialog"

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
        <DeleteCommentDialog commentId={data.id} postId={data.post_id} isOpen={isDelete} setIsOpen={setIsDelete}/>
        <Card className="flex p-6">
          {isUpdate ? (
            <>
              <UpdateCommentForm
                setUpdateCommentHandler={() => setIsUpdate(false)}
                commentData={data} />
            </>
        ) : (
        <>
          <div className="flex-1">
            <div className={`markdown-body prose light rounded-md`} >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {data.content}
              </ReactMarkdown>
            </div>
          </div>
          {(isLoggedIn && data.owner.username == usersInfo.username) &&
            <CommentItemMenu
              setUpdateCommentHandler={() => setIsUpdate(true)}
              setDeleteCommentHandler={() => setIsDelete(true)}
            />
          }
        </>
          )}
      </Card>
      </>
    )

return ref ? (
  <article ref={ref}>
    {commentItemContent}
  </article>
) : (
  <article>
    {commentItemContent}
  </article>
)
  }
)



export default CommentsItem;