import { useQuery } from "@tanstack/react-query"
import { getLikePostRecord } from "../services/postsApiService"
import { useEffect, useState } from "react"

export const useGetLikePostRecord = (postId: string) => {
    const [isLike, setIsLike] = useState(false)
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true)
        const fetchData = async () => {
            var data = await getLikePostRecord(postId)

            setIsLike(data.id.length > 0);
        }
        fetchData();
        setIsLoading(false);
    }, [postId]);


    const isLikeHandler = () => {
        setIsLike(v => !v);
    }

    return {isLike, isLoading, isLikeHandler}
}