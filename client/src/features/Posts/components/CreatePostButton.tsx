'use client'

import { Button } from "@/components/ui/button"
import { useGetCurrentUser } from "@/features/Auth/hooks/useGetCurrentUser";
import { useRouter } from "next/navigation"

const CreatePostButton = () => {
    const {data, isLoading} = useGetCurrentUser();
    const router = useRouter();

    const handler = () => {
        router.push("/posts/create");
    }

    if(isLoading)
        <p>Loading...</p>

    
    if(data) 
        return (<Button onClick={handler}>Create Post</Button>)
}

export default CreatePostButton;