'use client'

import Card from "@/components/layout/Card"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'
import { CreatePostInput, UpdatePostInput } from "../types/Posts";
import { ErrorMessage } from "@/components/ui/error-message";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { updateCommentSchema } from "@/features/Comments/schemas/commentsSchema";
import { useGetPostById } from "../hooks/useGetPostById";
import MDEditor from "@uiw/react-md-editor";
import { useUpdatePost } from "../hooks/useUpdatePost";
import { updatePostSchema } from "../schemas/postsSchema";

type UpdatePostFormType = {
    postId: string
}

const UpdatePostForm = ({ postId }: UpdatePostFormType) => {
    const router = useRouter();
    const {mutate, isLoading: updateLoading} = useUpdatePost()
    const { data, isLoading, isSuccess, isError } = useGetPostById(postId)
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<UpdatePostInput>({
        resolver: zodResolver(updatePostSchema)
    });
    const [content, setContent] = useState(data?.content)

    const submitPostHandler = (data: UpdatePostInput) => {
        mutate({
            id: postId,
            data: {
                title: data.title,
                content
            }
        }) 
    }

    useEffect(() => {
        if (isSuccess && !isError) {
            setValue("title", data.title)
            setContent(data.content)
        }
    }, [isSuccess])


    if (!data)
        return <p>Loading...</p>

    return (
        <Card>
            <div className="flex flex-col gap-10 p-2">
                <h2 className="font-bold text-2xl">Update your Post</h2>
                <form onSubmit={handleSubmit(submitPostHandler)} className="flex flex-col gap-4">
                    <div>
                        <Input {...register("title")} type="text" placeholder="Title" />
                        {errors.title && (<ErrorMessage message={errors.title.message} />)}
                    </div>

                    <div data-color-mode="light">
                        <MDEditor height={200} value={content} onChange={(v) => { setContent(v!) }} />
                    </div>

                    <div className="mt-[35px] flex justify-between">
                        <Button type="submit">
                            {updateLoading ? "Loading..." : "Update Post Content"}
                        </Button>
                        <Button type="button" onClick={() => { router.push('/') }}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </Card>
    );
}

export default UpdatePostForm;