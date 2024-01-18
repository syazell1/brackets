import axios from "axios"
import { POSTS_URL } from "client/constants/server-config"
import { PageList } from "client/types/page-lists.types"
import { PostsDetails } from "../types/posts.types"

export const getPosts = async (page: number) => {
  const res = await axios.get<PageList<PostsDetails[]>>(`${POSTS_URL}?page=${page}`)

  return res.data;
}
