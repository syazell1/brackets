'use client'

import { Controller, useForm } from "react-hook-form";
import { AddPostInput } from "../types/posts.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { addPostInputSchema } from "../schemas/posts.schema";
import { useAddPost } from "../hooks/useAddPost";
import MDEditor from "@uiw/react-md-editor";
import { Input } from "@/components/ui/input";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { ToastAction } from "@/components/ui/toast";

const AddPostForm = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<AddPostInput>({
    resolver: zodResolver(addPostInputSchema)
  })
  const { mutate, isPending, isSuccess, isError, error} = useAddPost();
  const router = useRouter();
  const {toast} = useToast();

  useEffect(() => {
    if(isSuccess) {
      toast({
        title: "Post was created Successfully",
        description: "Members can now read your post!",
        action: <ToastAction altText="View Post">View Post</ToastAction>,
      });
    }
  }, [isSuccess])

  useEffect(() => {
    if(isError) {
      console.log(error)
    }
  }, [isError, error])

  const addPostSubmitHandler = (data: AddPostInput) => {
    mutate(data)
  }

  return (
    <form onSubmit={handleSubmit(addPostSubmitHandler)} className="space-y-4">
      <div>
        <Input {...register("title")} placeholder="Post Title" />
        {errors.title?.message && <ErrorMessage message={errors.title.message!} />}
      </div>
      <div>
        <div data-color-mode="light">
          <Controller
            control={control}
            name="content"
            render={({
              field: { onChange, value, ref },
              fieldState: { error },
            }) => {
              return (
                <>
                  <MDEditor height={200} value={value} onChange={onChange} ref={ref} />
                  {error?.message && <ErrorMessage message={error.message!} />}
                </>
              )
            }}
          />
        </div>
      </div>
      <div className="space-x-4">
        <Button type="submit">Submit Post</Button>
        <Button type="button" variant="outline" onClick={() => router.push('/')}>Cancel</Button>
      </div>
    </form>
  )
}

export default AddPostForm;
