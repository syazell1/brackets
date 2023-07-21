'use client'

import { Button } from "@/components/ui/button"
import { useGetCurrentUser } from "@/features/Auth/hooks/useGetCurrentUser";
import { authProviderContext } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation"
import { useContext } from "react";

const CreatePostButton = () => {
    // const {data, isLoading} = useGetCurrentUser();
    const {data, isLoading} = useContext(authProviderContext)
    const router = useRouter();

    const handler = () => {
        router.push("/posts/create");
    }

    if(isLoading)
        <p>Loading...</p>

    
    if(data.username) 
        return (<Button onClick={handler}>Create Post</Button>)
}

export default CreatePostButton;