import axios, { isAxiosError } from "axios"
import { AddPostInput, PostsDetails, UpdatePostInput } from "../types/posts.types"
import { PageList } from "@/types/page-lists.types";
import { POSTS_URL } from "@/constants/server-config";
import client from "@/lib/axios";
import { ErrorResponse } from "@/types/error-response";

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
