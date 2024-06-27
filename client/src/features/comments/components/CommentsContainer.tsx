'use client'

import { authStore } from "@/providers/AuthStore"
import CommentsList from "./CommentsList";

const CommentsContainer = ({postId} : {postId: string}) => {
    const {isLoading} = authStore();

    return (
        <>{isLoading ? <p>Loading...</p> : <CommentsList postId={postId} />}</>
    )
}

export default CommentsContainer;