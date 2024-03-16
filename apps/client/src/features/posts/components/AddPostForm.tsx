'use client'

import MDEditor from "@uiw/react-md-editor";
import Input from "client/components/ui/Input";
import { Controller, useForm } from "react-hook-form";
import { AddPostInput } from "../types/posts.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { addPostInputSchema } from "../schemas/posts.schema";
import { useAddPost } from "../hooks/useAddPost";
import ErrorMessage from "client/components/ui/ErrorMessage";
import Button from "client/components/ui/Button";

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
        <Button variant="primary" type="submit">Submit Post</Button>
      </div>
    </form>
  )
}

export default AddPostForm;
