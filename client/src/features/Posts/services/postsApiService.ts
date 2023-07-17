import axios from "axios"
import { CreatePostInput, PostDetails } from "../types/Posts";
import { PagedList } from "@/types/PagedList";
import { POSTS_URL, USERS_URL } from "@/constants/server-config";
import client from "@/lib/axios";

export const getPosts = async (page: number) => {
    const res = await client.get<PagedList<PostDetails>>(`${POSTS_URL}?sortOrder=desc&page=${page}`);

    return res.data;
}

export const getPostsByOwnerName = async (username : string) => {
    const res = await client.get<PagedList<PostDetails>>(`${USERS_URL}/${username}/posts?sortOrder=desc`);

    return res.data;
}

export const getPostById = async (id: string) => {
    const res = await client.get<PostDetails>(`${POSTS_URL}/${id}`);

    return res.data;
}



export const createPost = async (data: CreatePostInput) => {
    const res = await client.post(`${POSTS_URL}`, data);

    return res.data;
}