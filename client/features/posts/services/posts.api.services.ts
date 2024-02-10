import axios from "axios"
import { POSTS_URL } from "client/constants/server-config"
import { PageList } from "client/types/page-lists.types"
import { AddPostInput, PostsDetails, UpdatePostInput } from "../types/posts.types"
import client from "client/libs/axios"

export const getPosts = async (page: number) => {
  const res = await axios.get<PageList<PostsDetails[]>>(`${POSTS_URL}?page=${page}`)

  return res.data;
}

export const addPost = async (data: AddPostInput) => {
  const res = await client.post(`${POSTS_URL}`, data);

  return res.data;
}

export const updatePost = async (id: string, data: UpdatePostInput) => {
  const res = await client.patch(`${POSTS_URL}/${id}`, data);

  return res.data;
}

export const deletePost = async (id: string) => {
  const res = await client.delete(`${POSTS_URL}/${id}`);

  return res.data;
}
