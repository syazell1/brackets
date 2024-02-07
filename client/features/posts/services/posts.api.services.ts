import axios from "axios"
import { POSTS_URL } from "client/constants/server-config"
import { PageList } from "client/types/page-lists.types"
import { AddPostInput, PostsDetails } from "../types/posts.types"
import client from "client/libs/axios"

export const getPosts = async (page: number) => {
  const res = await axios.get<PageList<PostsDetails[]>>(`${POSTS_URL}?page=${page}`)

  return res.data;
}

export const addPost = async (data: AddPostInput) => {
  const res = await client.post(`${POSTS_URL}`, data);

  return res.data;
}

// TODO: add update post service
export const updatePost = async (data: AddPostInput) => {
  const res = await client.post(`${POSTS_URL}`, data);

  return res.data;
}

// TODO: add delete post service
export const deletePost = async (data: AddPostInput) => {
  const res = await client.post(`${POSTS_URL}`, data);

  return res.data;
}
