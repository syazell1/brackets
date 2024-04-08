'use client'

import Modal from "client/components/ui/Modal";
import styles from './DeletePostConfirmModal.module.css'
import Button from "client/components/ui/Button";
import { useDeletePost } from "../hooks/useDeletePost";
import { useEffect } from "react";
import { useRouter } from "next/router";

type DeletePostConfirmModalType = {
  postId: string,
  closeModalHandler: () => void
}

const DeletePostConfirmModal = ({
  postId,
  closeModalHandler
}: DeletePostConfirmModalType) => {
  const {
    mutate,
    isPending
  } = useDeletePost()

  const submitDeleteHandler = () => {
    mutate(postId)
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

export default DeletePostConfirmModal;
