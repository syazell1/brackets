import axios, { isAxiosError } from "axios"
import { POSTS_URL } from "client/constants/server-config"
import { PageList } from "client/types/page-lists.types"
import { AddPostInput, PostsDetails, UpdatePostInput } from "../types/posts.types"
import client from "client/libs/axios"
import { ErrorResponse } from "client/types/error-response"

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

  if (isAxiosError<ErrorResponse>(res)) {
    if (res.response?.data.status_code === 404) {
      throw new Error("Post was not found.")
    }
  }

  return res.data;
}

export const deletePost = async (id: string) => {
  const res = await client.delete(`${POSTS_URL}/${id}`);

  if (isAxiosError<ErrorResponse>(res)) {
    if (res.response?.data.status_code === 404) {
      throw new Error("Post was not found.")
    }
  }

  return res.data;
}
