import Modal from 'client/components/ui/Modal'
import styles from './DeleteCommentConfirmModal.module.css'
import { useDeleteComment } from '../hooks/useDeleteComment'
import { useEffect } from 'react'
import Button from 'client/components/ui/Button'
import { useQueryClient } from '@tanstack/react-query'
import { CommentsData } from '../types/comments.type'

type DeleteCommentConfirmModalType = {
  commentData: CommentsData,
  closeModalHandler: () => void
}

const DeleteCommentConfirmModal = ({ commentData, closeModalHandler }: DeleteCommentConfirmModalType) => {
  const queryClient = useQueryClient();
  const {
    mutate,
    isPending,
    isSuccess
  } = useDeleteComment();

  useEffect(() => {
    if (isSuccess) {
      queryClient.invalidateQueries({
        queryKey: ["comments", { id: commentData.post_id }]
      })

      closeModalHandler();
    }
  }, [isSuccess])

  const submitDeleteHandler = () => {
    mutate(commentData.id)
  }

  return (
    <Modal
      title="Delete Comment"
      closeHandler={closeModalHandler}
    >
      <div className={styles.content}>
        <p>Are you sure you want to delete this comment?</p>
      </div>

      <div className={styles.controller}>
        <Button variant='primary' onClick={submitDeleteHandler}>
          {isPending ? "Loading..." : "Confirm"}
        </Button>

        <Button variant='secondary' onClick={closeModalHandler}>
          Cancel
        </Button>
      </div>
    </Modal>
  )
}

export default DeleteCommentConfirmModal
