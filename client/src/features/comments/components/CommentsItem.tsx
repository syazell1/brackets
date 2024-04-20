'use client'

import { CommentsData } from "../types/comments.type"
import { forwardRef, useContext, useState } from "react"
import UpdateCommentForm from "./UpdateCommentForm"
import { authContextProvider } from "@/providers/AuthContext"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import remarkGfm from 'remark-gfm'
import ReactMarkdown from 'react-markdown'
import CommentItemMenu from "./CommentItemMenu"
import DeleteCommentDialog from "./DeleteCommentDialog"
import UserAvatar from "@/features/users/components/UserAvatar"

type CommentsItemType = {
  data: CommentsData
}

const CommentsItem = forwardRef<HTMLElement, CommentsItemType>(
  ({ data }, ref) => {
    const { isLoggedIn, usersInfo } = useContext(authContextProvider)
    const [isUpdate, setIsUpdate] = useState(false);
    const [isDelete, setIsDelete] = useState(false);

    const createdDate = new Date(data.created_at);

    const commentItemContent = (
      <>
        <DeleteCommentDialog commentId={data.id} postId={data.post_id} isOpen={isDelete} setIsOpen={setIsDelete} />
        <Card>
          {isUpdate ? (
            <>
              <UpdateCommentForm
                setUpdateCommentHandler={() => setIsUpdate(false)}
                commentData={data} />
            </>
          ) : (
            <>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex gap-2 items-center">
                <div>
                  <UserAvatar />
                </div>
                <div>
                  <p className="font-semibold">{data.owner.username}</p>
                  <p className="text-xs">{createdDate.toDateString()}</p>
                </div>
              </div>
              {(isLoggedIn && data.owner.username == usersInfo.username) &&
                <CommentItemMenu
                  setUpdateCommentHandler={() => setIsUpdate(true)}
                  setDeleteCommentHandler={() => setIsDelete(true)}
                />
              }
            </CardHeader>
                <CardContent >
                  <div className={`markdown-body prose light rounded-md`} >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {data.content}
                    </ReactMarkdown>
                  </div>
                </CardContent>
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