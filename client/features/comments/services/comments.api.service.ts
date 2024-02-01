import { PageList } from 'client/types/page-lists.types'
import client from '../../../libs/axios'
import { CommentsData } from '../types/comments.type'
import { POSTS_URL } from 'client/constants/server-config'

export const getPostsComments = async (postId: string, page: number) => {
  const res = await client<PageList<CommentsData[]>>(`${POSTS_URL}/${postId}/comments?page=${page}`);

  return res.data;
}

// TODO : add add comments service
// add schema and validations
export const addComments = () => {

}

// TODO : add update comments service
// add schema and validations
export const updateComments = () => {

}


// TODO : add delete  comments service
export const deleteComments = () => {

}
