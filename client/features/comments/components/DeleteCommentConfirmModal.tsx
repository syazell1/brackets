import Modal from 'client/components/ui/Modal'
import styles from './DeleteCommentConfirmModal.module.css'
import { useDeleteComment } from '../hooks/useDeleteComment'
import { useEffect } from 'react'
import Button from 'client/components/ui/Button'
import { useQueryClient } from '@tanstack/react-query'

type DeleteCommentConfirmModalType = {
  commentId: string
  closeModalHandler: () => void
}

const DeleteCommentConfirmModal = ({ commentId, closeModalHandler }: DeleteCommentConfirmModalType) => {
  const queryClient = useQueryClient();
  const {
    mutate,
    isPending,
    isSuccess
  } = useDeleteComment();

  useEffect(() => {
    if (isSuccess) {
      queryClient.invalidateQueries({

        // TODO: add post id in the id object
        // to invalidate only the comments on the certain post
        queryKey: ["comments"]
      })

      closeModalHandler();
    }
  }, [isSuccess])

  const submitDeleteHandler = () => {
    mutate(commentId)
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
