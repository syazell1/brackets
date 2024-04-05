'use client'

import { Controller, useForm } from "react-hook-form";
import { AddCommentInput } from "../types/comments.type";
import { useAddComment } from "../hooks/useAddComment";
import MDEditor from "@uiw/react-md-editor";
import styles from './AddCommentForm.module.css'
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import ErrorMessage from "@repo/ui/components/ErrorMessage";
import { Button } from "@repo/ui/components/button";

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
                <MDEditor height={200} value={value} onChange={onChange} ref={ref}  />
                {error?.message && <ErrorMessage message={error.message} />}
              </>
            )
          }}
        />
      </div>
      <div>
        <Button>
          {isPending ? "Loading..." : "Submit"}
        </Button>
      </div>
    </form>
  )
}

export default AddCommentForm;
