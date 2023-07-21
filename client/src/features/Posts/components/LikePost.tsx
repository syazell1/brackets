'use client'

import { useLikePost } from "../hooks/useLikePost";
import { useGetLikePostRecord } from "../hooks/useGetLikePostRecord";
import { useUnlikePost } from "../hooks/useUnlikePost";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useContext, useState } from "react";
import { authProviderContext } from "@/providers/AuthProvider";
import { RiHeartsLine } from "react-icons/ri";


type LikePostButtonType = {
    postId: string,
    likesCount: number
}

const LikePost = ({ postId, likesCount }: LikePostButtonType) => {
    // const { data, isLoading: userLoading } = useGetCurrentUser();
    const [count, setCount] = useState(likesCount)
    const { data, isLoading: userLoading } = useContext(authProviderContext)
    const { isLike, isLikeHandler, isLoading } = useGetLikePostRecord(postId);
    const { mutate: like } = useLikePost();
    const { mutate: unlike } = useUnlikePost()

    const likeHandler = () => {
        like(postId);
        isLikeHandler();
        setCount(c => c+=1)
    }

    const unlikeHandler = () => {
        unlike(postId);
        isLikeHandler();
        setCount(c => c-=1)
    }

    if (isLoading || userLoading)
        return <p>Loading...</p>


    if (data.username)
        return (
            <>
                {isLike ?
                    (<FaHeart className="cursor-pointer" size={25} onClick={unlikeHandler} />) 
                    : (<FaRegHeart className="cursor-pointer" size="25" onClick={likeHandler} />)}
                {count && <p>{count} Likes</p>}
            </>
        );


    return (
        <>
            <RiHeartsLine size={25} />
            {count && <p>{count} Likes</p>}
        </>
    )
}

export default LikePost;