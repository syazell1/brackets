'use client'

import { Heart } from "lucide-react"
import { useEffect, useState } from "react"
import { useLikePost } from "../hooks/useLikePost"
import { useUnlikePost } from "../hooks/useUnlikePost"
import { authStore } from "@/providers/AuthStore"

type PostLikesButtonProp = {
    postId: string,
    likesCount: number,
    isLiked: boolean
}

const PostLikesButton = ({ postId, likesCount, isLiked }: PostLikesButtonProp) => {
    const { isLoggedIn } = authStore();
    const [totalLikes, setTotalLikes] = useState(likesCount)
    const [liked, setLiked] = useState(isLiked)
    const { mutate, isSuccess } = useLikePost();
    const { mutate: unlike, isSuccess: unlikeSuccess } = useUnlikePost();


    useEffect(() => {
        if (isSuccess) {
            setTotalLikes(v => v += 1);
        }
    }, [isSuccess]);

    useEffect(() => {
        if (unlikeSuccess) {
            setTotalLikes(v => v - 1);
        }
    }, [unlikeSuccess])

    const likeHandler = () => {
        mutate(postId);
        setLiked(true);
    }

    const unlikeHandler = () => {
        unlike(postId);
        setLiked(false);
    }

    if (isLoggedIn) {
        return (
            <div className="flex gap-2">
                {
                    liked ?
                        <Heart className="cursor-pointer" onClick={unlikeHandler} fill="#ef4444" /> :
                        <Heart className="cursor-pointer" onClick={likeHandler} />
                }
                <p>{totalLikes}</p>
            </div>
        )
    }

    return <div className="flex gap-2">
        <Heart className="cursor-pointer" onClick={likeHandler} />
        <p>{totalLikes}</p>
    </div> 
}

export default PostLikesButton;