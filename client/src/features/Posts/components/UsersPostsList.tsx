'use client'

import { useGetPostsByOwnerName } from "../hooks/useGetPostsByOwnerName";
import PostItem from "./PostItem";

type UsersPostsListType = {
    username : string 
}

const UsersPostsList = ({username} : UsersPostsListType) => {
    const {data} = useGetPostsByOwnerName(username);

    if(!data)
        return <p>Loading...</p>

    return (
        <ul className="flex flex-col gap-4">
            {data?.results.map(v => {
                return (
                    <PostItem key={v.id} data={v} />
                )
            })}
        </ul> 
    );
}

export default UsersPostsList; 