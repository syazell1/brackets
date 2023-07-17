'use client'

import Card from "@/components/layout/Card"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'
import { createPostSchema } from "../schemas/postsSchema";
import { CreatePostInput } from "../types/Posts";
import { useCreatePost } from "../hooks/useCreatePost";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ErrorMessage } from "@/components/ui/error-message";
import { useRouter } from "next/navigation";

const CreatePostForm = () => {
    const router = useRouter();
    const { isLoading, mutate } = useCreatePost();
    const { register, handleSubmit, formState: { errors } } = useForm<CreatePostInput>({
        resolver: zodResolver(createPostSchema)
    });

    const submitPostHandler = (data: CreatePostInput) => {
        mutate(data);
    }

    return (
        <Card>
            <div className="flex flex-col gap-10 p-2">
                <h2 className="font-bold text-2xl">Create a Post</h2>
                <form onSubmit={handleSubmit(submitPostHandler)} className="flex flex-col gap-4">
                    <div>
                        <Input {...register("title")} type="text" placeholder="Title" />
                        {errors.title && (<ErrorMessage message={errors.title.message} />)}
                    </div>
                    <div>
                        <div className="grid w-full gap-1.5">
                            <Label htmlFor="content">Your Content</Label>
                            <Textarea {...register("content")} placeholder="Type your content here." id="content" />
                            {errors.content && (<ErrorMessage message={errors.content.message} />)}
                        </div>
                    </div>
                    <div className="mt-[35px] flex justify-between">
                        <Button type="submit">
                            {isLoading ? "Loading..." : "Submit Content"}
                        </Button>
                         <Button type="button" onClick={() => {router.push('/')}}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </Card>
    );
}

export default CreatePostForm;