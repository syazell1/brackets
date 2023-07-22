'use client'

import { useInView } from "react-intersection-observer";
import { useGetCommentsByPostId } from "../hooks/useGetCommentsByPostId";
import CommentItem from "./CommentItem";
import { useEffect } from "react";

type PostCommentsListType = {
    postId: string 
}

const PostCommentsList = ({postId} : PostCommentsListType) => {
    const {ref, inView} = useInView();
    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status
    } = useGetCommentsByPostId(postId);

    
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
                        return <CommentItem key={post.id} data={post} ref={ref} />
                    }
                    return <CommentItem key={post.id} data={post} />
                })
            )}
            {isFetchingNextPage && <h3>Loading...</h3>}
        </ul> 
    )

}

export default PostCommentsList;


    // if(data.pages[0].results.length == 0)
    //     return <p className="italic mt-[20px]">No Available Comments</p>