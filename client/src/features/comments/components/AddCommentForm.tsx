'use client'

import { Controller, useForm } from "react-hook-form";
import { AddCommentInput } from "../types/comments.type";
import { useAddComment } from "../hooks/useAddComment";
import MDEditor from "@uiw/react-md-editor";
import styles from './AddCommentForm.module.css'
import { useEffect } from "react";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { Button } from "@/components/ui/button";


type AddCommentFormType = {
  postId: string
}

const AddCommentForm = ({ postId }: AddCommentFormType) => {
  const {
    handleSubmit,
    control,
    setValue
  } = useForm<AddCommentInput>({
    defaultValues: {
      post_id: postId
    }
  })

  const {
    mutate,
    isPending,
    isSuccess
  } = useAddComment(postId)
  
  useEffect(() => {
    if(isSuccess) {
      setValue("content", "")  
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
