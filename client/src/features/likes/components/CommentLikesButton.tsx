'use client'

import { Heart } from "lucide-react"
import { useEffect, useState } from "react"
import { authStore } from "@/providers/AuthStore"
import { useLikeComment } from "../hooks/useLikeComment"
import { useUnlikeComment } from "../hooks/useUnlikeComment"

type CommentLikesButtonProp = {
    commentId: string,
    likesCount: number,
    isLiked: boolean
}

const CommentLikesButton = ({ commentId, likesCount, isLiked }: CommentLikesButtonProp) => {
    const { isLoggedIn } = authStore();
    const [totalLikes, setTotalLikes] = useState(likesCount)
    const [liked, setLiked] = useState(isLiked)
    const { mutate, isSuccess } = useLikeComment();
    const { mutate: unlike, isSuccess: unlikeSuccess } = useUnlikeComment();


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
        mutate(commentId);
        setLiked(true);
    }

    const unlikeHandler = () => {
        unlike(commentId);
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

export default CommentLikesButton;