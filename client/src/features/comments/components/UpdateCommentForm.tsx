'use client'

import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AddCommentInputSchema } from '../schemas/comments.schema'
import MDEditor from '@uiw/react-md-editor'
import { useUpdateComment } from '../hooks/useUpdateComment'
import { CommentsData, UpdateCommentInput } from '../types/comments.type'
import styles from './UpdateCommentForm.module.css'
import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import ErrorMessage from '@/components/ui/ErrorMessage'
import { Button } from '@/components/ui/button'

type UpdateCommentFormType = {
  commentData: CommentsData,
  setUpdateCommentHandler: () => void
}

const UpdateCommentForm = ({ commentData, setUpdateCommentHandler }: UpdateCommentFormType) => {
  const queryClient = useQueryClient();
  const {
    mutate,
    isPending,
    isSuccess
  } = useUpdateComment()
  const {
    handleSubmit,
    control
  } = useForm<UpdateCommentInput>({
    resolver: zodResolver(AddCommentInputSchema),
    defaultValues: {
      content: commentData.content,
      post_id: commentData.post_id
    }
  })

  useEffect(() => {
    if (isSuccess) {
      queryClient.invalidateQueries({
        queryKey: ["comments", { id: commentData.post_id }]
      })
      setUpdateCommentHandler();
    }
  }, [isSuccess])

  const updateCommentHandler = (data: UpdateCommentInput) => {

    mutate({
      id: commentData.id,
      data
    })
  }



  return (
    <form onSubmit={handleSubmit(updateCommentHandler)}
      className='flex flex-col gap-2 flex-1'
    >
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
                {error?.message && <ErrorMessage message={error.message} />}
              </>
            )
          }}
        />
      </div>
      <div className={styles.controller}>
        <Button type='submit'>
          {isPending ? "Loading..." : "Submit"}
        </Button>
        <Button variant="secondary" onClick={setUpdateCommentHandler}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

export default UpdateCommentForm;
