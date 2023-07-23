import axios, { Axios, AxiosError } from "axios"
import { CreatePostInput, PostDetails } from "../types/Posts";
import { PagedList } from "@/types/PagedList";
import { POSTS_URL, USERS_URL } from "@/constants/server-config";
import client from "@/lib/axios";

export const getPosts = async (page: number, search?: string) => {

    let url = `${POSTS_URL}?sortOrder=desc&page=${page}`

    if(search != undefined)
        url += `&search=${search}`

    const res = await client.get<PagedList<PostDetails>>(url);

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

export const updatePost = async (id:string, data: CreatePostInput) => {

    const json = JSON.stringify([
        {op: "replace", path: "title", value: data.title},
        {op: "replace", path: "content", value: data.content},
    ])

    const res = await client.patch(`${POSTS_URL}/${id}`, json);

    return res.data;
}

export const deletePost = async (id: string) => {
    const res = await client.delete(`${POSTS_URL}/${id}`);

    return res.data;
}

export const likePost = async (id: string) => {
    const res = await client.post(`${POSTS_URL}/${id}/like`);

    return res.data;
}

export const unlikePost = async (id: string) => {
    const res = await client.post(`${POSTS_URL}/${id}/unlike`);

    return res.data;
}

export const getLikePostRecord = async (id: string) => {
    try
    {
        const res = await client.get<{id: string}>(`${POSTS_URL}/${id}/record`);

        if(res instanceof AxiosError && res.response?.status === 404) 
        {
            throw new Error("hhhe")
        }

        return res.data;
    }   
    catch(err : any)
    {
        console.log(err)
        return {id: ""};
    }
}