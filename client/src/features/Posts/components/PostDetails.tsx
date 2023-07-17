'use client'

import Card from "@/components/layout/Card"
import { useGetPostById } from "../hooks/useGetPostById";

type PostDetailsType = {
    id: string
}

const PostDetails = ({id} : PostDetailsType) => {
    const {data, isLoading} = useGetPostById(id);
    
    if(!data)
        return <p>Loading...</p>

    return (
        <Card>
            <p>{data.title}</p>
        </Card>
    )
}

export default PostDetails;