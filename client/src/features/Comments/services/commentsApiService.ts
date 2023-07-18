import client from "@/lib/axios"
import { PagedList } from "@/types/PagedList"
import { AddCommentInput, CommentDetails } from "../types/Comments"
import { COMMENTS_URL, POSTS_URL } from "@/constants/server-config"

export const getCommentsByPostId = async (page: number, postId : string) => {
    const res = await client.get<PagedList<CommentDetails>>(`${POSTS_URL}/${postId}/comments`)

    return res.data
}

export const getCommentById = async (commentId: string) => {
    const res = await client.get<CommentDetails>(`${COMMENTS_URL}/${commentId}`)

    return res.data
}

export const addComment = async (data : AddCommentInput) => {
    const res = await client.post(`${COMMENTS_URL}`, data)

    return res.data
}
