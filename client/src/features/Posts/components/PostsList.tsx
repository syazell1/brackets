'use client'

import { useInView } from "react-intersection-observer";
import { useGetPosts } from "../hooks/useGetPosts"
import PostItem from "./PostItem";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const PostsList = () => {
    const {ref, inView} = useInView();
    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status
    } = useGetPosts();

    
    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, fetchNextPage, hasNextPage]);

    if(!data)
        return <p>Loading...</p>

    if(data.pages[0].results.length == 0)
        return <p>No Posts Available</p>

    return (
        <ul className="flex flex-col gap-4">
             {data.pages.map((group, ind) =>
                group.results.map((post, i) => {
                    if (group.results.length === i + 1) {
                        return <PostItem key={post.id} data={post} ref={ref} />
                    }
                    return <PostItem key={post.id} data={post} />
                })
            )}
            {isFetchingNextPage && <h3>Loading...</h3>}
        </ul> 
    )

    
}

export default PostsList