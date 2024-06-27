'use client'

import { authStore } from "@/providers/AuthStore";
import PostsLists from "./PostsList";

const Posts = () => {
    const {isLoading} = authStore();

    return (
        <>
            {isLoading ? <p>Loading...</p> : <PostsLists />}
        </>
    )
}

export default Posts; 