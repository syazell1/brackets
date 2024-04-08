'use client'

import { Controller, useForm } from "react-hook-form";
import { AddPostInput } from "../types/posts.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { addPostInputSchema } from "../schemas/posts.schema";
import { useAddPost } from "../hooks/useAddPost";
import { Input } from "@repo/ui/components/input";
import ErrorMessage from "@repo/ui/components/ErrorMessage";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@repo/ui/components/button";

const AddPostForm = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<AddPostInput>({
    resolver: zodResolver(addPostInputSchema)
  })
  const { mutate, isPending } = useAddPost();

  const addPostSubmitHandler = (data: AddPostInput) => {
    mutate(data)
  }

  return (
    <form onSubmit={handleSubmit(addPostSubmitHandler)}>
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
      <div>
        <Button type="submit">Submit Post</Button>
      </div>
    </form>
  )
}

export default AddPostForm;
