import { COMMENTS_URL } from '@/constants/server-config';
import client from '../../../../../client/src/lib/axios'
import { AddCommentInput, CommentsData, UpdateCommentInput } from '../types/comments.type'

// export const getPostsComments = async (postId: string, page: number) => {
//   const res = await client.get<PageList<CommentsData[]>>(`${POSTS_URL}/${postId}/comments?page=${page}`);

//   return res.data;
// }

// export const addComments = async (data: AddCommentInput) => {
//   const res = await client.post(`${COMMENTS_URL}`, data);

//   return res.data;
// }

// TODO : add update comments service
// add schema and validations
export const updateComments = async (id: string, data: UpdateCommentInput) => {
  const res = await client.patch(`${COMMENTS_URL}/${id}`, data);

  return res.data;
}


export const deleteComments = async (id: string) => {
  const res = await client.delete(`${COMMENTS_URL}/${id}`);

  return res.data;
}
