'use client'

import { Button } from "@/components/ui/button";
import { useGetUserFollowStatus } from "../hooks/useGetUserFollowStatus";
import { useFollowUser } from "../hooks/useFollowUser";
import { useUnfollowUser } from "../hooks/useUnfollowUser";
import { useEffect } from "react";

const FollowButton = ({userId} : {userId : string}) => {
    const {isFollowing, isLoading, setIsFollowing} = useGetUserFollowStatus(userId);
    const {mutate : follow, isPending: followLoading, isSuccess : followSuccess} = useFollowUser();
    const {mutate : unfollow, isPending : unfollowLoading, isSuccess : unfollowSucess} = useUnfollowUser();

    useEffect(() => {
        if(followSuccess) {
            setIsFollowing(true) 
        }
    }, [followSuccess])

    useEffect(() => {
        if(unfollowSucess) {
            setIsFollowing(false) 
        }
    }, [unfollowSucess])

    if(isLoading) {
        return <p>Loading...</p>
    }

    return isFollowing ? (
        <Button onClick={() => unfollow(userId)} variant="outline" className="w-full">
            {unfollowLoading ? "Loading" : "Unfollow"}
        </Button>
    ) : (
        <Button onClick={() => follow(userId)} className="w-full">
            {followLoading ? "Loading" : "Follow"}
        </Button>
    )
}

export default FollowButton;