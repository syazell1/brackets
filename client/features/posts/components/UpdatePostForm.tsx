'use client'

import { Controller, useForm } from 'react-hook-form'
import styles from './UpdatePostForm.module.css'
import { PostsDetails, UpdatePostInput } from '../types/posts.types'
import { zodResolver } from '@hookform/resolvers/zod'
import { addPostInputSchema } from '../schemas/posts.schema'
import Input from 'client/components/ui/Input'
import ErrorMessage from 'client/components/ui/ErrorMessage'
import Button from 'client/components/ui/Button'
import MDEditor from '@uiw/react-md-editor'
import { useUpdatePost } from '../hooks/useUpdatePost'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

type UpdatePostFormType = {
  data: PostsDetails
}

const UpdatePostForm = ({ data }: UpdatePostFormType) => {
  const router = useRouter();

  const {
    mutate,
    isPending,
    isSuccess
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

  useEffect(() => {
    if (isSuccess) {
      router.push(`/posts/${data.id}`)
    }
  }, [isSuccess])

  const handleUpdatePostHandler = (updatedPostData: UpdatePostInput) => {
    mutate({
      id: data.id,
      data: updatedPostData
    })
  }


  return (
    <form onSubmit={handleSubmit(handleUpdatePostHandler)} className={styles.container}>
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
      <div className={styles.controller}>
        <Button variant="primary" type="submit">
          {isPending ? "Loading..." : "Update Post"}
        </Button>

        <Button variant="secondary" onClick={() => router.push(`/posts/${data.id}`)}  >
          Cancel
        </Button>
      </div>
    </form>
  )
}

export default UpdatePostForm;
