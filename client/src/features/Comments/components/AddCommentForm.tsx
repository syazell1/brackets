'use client'

import Card from "@/components/layout/Card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { useAddComment } from "../hooks/useAddComment"
import { AddCommentInput } from "../types/Comments"
import { zodResolver } from "@hookform/resolvers/zod"
import { addCommentSchema } from "../schemas/commentsSchema"
import { ErrorMessage } from "@/components/ui/error-message"
import { useContext, useEffect } from "react"
import { useGetCurrentUser } from "@/features/Auth/hooks/useGetCurrentUser"
import { authProviderContext } from "@/providers/AuthProvider"

type AddCommentFormType = {
    postId : string
}

const AddCommentForm = ({postId}: AddCommentFormType) => {
    // const {data, isLoading: userDataLoading} = useGetCurrentUser();
    const {data, isLoading: userDataLoading} = useContext(authProviderContext)
    const {reset, handleSubmit, register, formState: {errors}} = useForm<AddCommentInput>({
        resolver: zodResolver(addCommentSchema)
    });
    const {mutate, isLoading, isSuccess} = useAddComment();

    useEffect(() => {
        if(isSuccess)
        {
            reset()
        }
    }, [isSuccess, reset])

    const addCommentHandler = (data : AddCommentInput) => {

        mutate({
            postId,
            content : data.content
        })
    }

    if(userDataLoading && isLoading)
        return <p>Loading...</p>

    if(data.username)
         return (
            <Card>
                <form onSubmit={handleSubmit(addCommentHandler)} className="flex flex-col gap-2">
                    <div>
                        <Textarea {...register("content")} placeholder="Add your Comment Here" />
                        {errors.content && (<ErrorMessage message={errors.content.message} />)}
                    </div>
                    <div>
                        <Button type="submit">{isLoading ? "Loading..." : "Submit"}</Button>
                    </div>
                </form>
            </Card>
        )
}

export default AddCommentForm;