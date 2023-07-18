'use client'

import { Separator } from "@/components/ui/separator"
import UsersPostsList from "./UsersPostsList"
import { useGetCurrentUser } from "@/features/Auth/hooks/useGetCurrentUser"

type UsersPostsType = {
    username: string
}

const UsersPosts = ({username} : UsersPostsType) => {
    const {data} = useGetCurrentUser();

    return (
        <>
            <div className="flex justify-between items-center gap-4 pt-[20px]">
                <h2 className="text-lg font-semibold">
                    {data?.username == username ? "Your Posts" : `@${username}'s Posts`}
                </h2>
            </div>
            <Separator className="my-4" />
            <UsersPostsList username={username} />
        </>
    );
}

export default UsersPosts;