'use client'

import { Controller, useForm } from 'react-hook-form'
import { PostsDetails, UpdatePostInput } from '../types/posts.types'
import { zodResolver } from '@hookform/resolvers/zod'
import { addPostInputSchema } from '../schemas/posts.schema'
import MDEditor from '@uiw/react-md-editor'
import { useUpdatePost } from '../hooks/useUpdatePost'
import { notFound, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ErrorMessage from '@/components/ui/ErrorMessage'

type UpdatePostFormType = {
  data: PostsDetails
}

const UpdatePostForm = ({ data }: UpdatePostFormType) => {
  const router = useRouter();

  const {
    mutate,
    isPending,
  } = useUpdatePost()

  const {
    control,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<UpdatePostInput>({
    defaultValues: {
      title: data.title,
      content: data.content
    },
    resolver: zodResolver(addPostInputSchema)
  })


  const handleUpdatePostHandler = (updatedPostData: UpdatePostInput) => {
    mutate({
      id: data.id,
      data: updatedPostData
    })
  }


  return (
    <form onSubmit={handleSubmit(handleUpdatePostHandler)} className="space-y-4">
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
      <div className="space-x-2">
        <Button type="submit">
          {isPending ? "Loading..." : "Update Post"}
        </Button>

        <Button variant="secondary" type='button' onClick={() => router.push(`/posts/${data.id}`)}  >
          Cancel
        </Button>
      </div>
    </form>
  )
}

export default UpdatePostForm;
