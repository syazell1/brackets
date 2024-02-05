'use client'

import { Controller, useForm } from 'react-hook-form'
import styles from './UpdateComment.module.css'
import { zodResolver } from '@hookform/resolvers/zod'
import { AddCommentInputSchema } from '../schemas/comments.schema'
import MDEditor from '@uiw/react-md-editor'
import ErrorMessage from 'client/components/ui/ErrorMessage'
import { useUpdateComment } from '../hooks/useUpdateComment'
import Button from 'client/components/ui/Button'
import { UpdateCommentInput } from '../types/comments.type'

const UpdateCommentForm = () => {
  const {
    mutate,
    isPending
  } = useUpdateComment()
  const {
    handleSubmit,
    control
  } = useForm<UpdateCommentInput>({
    resolver: zodResolver(AddCommentInputSchema)
  })

  const addCommentHandler = (data: UpdateCommentInput) => {
    mutate({
      id: "",
      data
    })
  }


  return (
    <form onSubmit={handleSubmit(addCommentHandler)} className={styles.container}>
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
                <MDEditor height={200} value={value} onChange={onChange} ref={ref} placeholder="Add Comments to Post" />
                {error?.message && <ErrorMessage message={error.message} />}
              </>
            )
          }}
        />
      </div>
      <div>
        <Button variant="primary">
          {isPending ? "Loading..." : "Submit"}
        </Button>
      </div>
    </form>
  )
}

export default UpdateCommentForm;
