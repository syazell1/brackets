'use client'

import { Controller, useForm } from "react-hook-form";
import { AddCommentInput } from "../types/comments.type";
import { useAddComment } from "../hooks/useAddComment";
import MDEditor from "@uiw/react-md-editor";
import ErrorMessage from "client/components/ui/ErrorMessage";
import Button from "client/components/ui/Button";
import styles from './AddCommentForm.module.css'
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

type AddCommentFormType = {
  postId: string
}

const AddCommentForm = ({ postId }: AddCommentFormType) => {
  const {
    handleSubmit,
    control
  } = useForm<AddCommentInput>({
    defaultValues: {
      post_id: postId
    }
  })

  const {
    mutate,
    isPending,
    isSuccess
  } = useAddComment()

  const queryClient = useQueryClient();

  useEffect(() => {
    if (isSuccess) {
      queryClient.invalidateQueries({
        queryKey: ["comments", { id: postId }]
      })
    }
  }, [isSuccess])

  const addCommentHandler = (data: AddCommentInput) => {
    mutate(data)
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

export default AddCommentForm;
