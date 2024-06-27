'use client'

import { CommentsData } from "../types/comments.type"
import { forwardRef, useContext, useState } from "react"
import UpdateCommentForm from "./UpdateCommentForm"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import remarkGfm from 'remark-gfm'
import ReactMarkdown from 'react-markdown'
import CommentItemMenu from "./CommentItemMenu"
import DeleteCommentDialog from "./DeleteCommentDialog"
import UserAvatar from "@/features/users/components/UserAvatar"
import { authStore } from "@/providers/AuthStore"
import CommentLikesButton from "@/features/likes/components/CommentLikesButton"

type CommentsItemType = {
  data: CommentsData
}

const CommentsItem = forwardRef<HTMLElement, CommentsItemType>(
  ({ data }, ref) => {
    const { isLoggedIn, authInfo } = authStore();
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
                {(isLoggedIn && data.owner.username == authInfo.username) &&
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
              <CardFooter>
                <CommentLikesButton isLiked={data.is_liked} commentId={data.id} likesCount={data.likes_count} />
              </CardFooter>
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

CommentsItem.displayName = "CommentsItem"

export default CommentsItem;