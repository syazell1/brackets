import { useAxios } from "@/hooks/useAxios"
import { useEffect, useState } from "react"

interface UserFollowingStatusResponse {
    is_following : boolean
}

export const useGetUserFollowStatus = (userId : string) => {
    const [isLoading, setIsLoading] = useState(true)
    const [isFollowing, setIsFollowing] = useState(false)
    const client = useAxios();

    useEffect(() => {
        (async () => {
            const res = await client.get<UserFollowingStatusResponse>(`/users/${userId}/status`);

            setIsFollowing(res.data.is_following)
            setIsLoading(false)
        })()
    }, [])

    return {
        isFollowing,
        isLoading,
        setIsFollowing
    }
}