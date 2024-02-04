'use client'

import { MoreVertical } from "lucide-react";
import styles from './CommentItemMenu.module.css'
import { useState } from "react";
import DeleteCommentConfirmModal from "./DeleteCommentConfirmModal";

type CommentItemMenuType = {
  commentId: string
}

const CommentItemMenu = ({ commentId }: CommentItemMenuType) => {
  const [isDelete, setIsDelete] = useState(false)

  return (
    <>
      {isDelete && <DeleteCommentConfirmModal commentId={commentId} closeModalHandler={() => setIsDelete(false)} />}
      <div className={styles.container}>
        <div className={styles["dropdown-btn"]}>
          <MoreVertical />
        </div>
        <div className={styles["dropdown-content"]}>
          <h4>Comments Menu</h4>
          <hr />
          <ul className={styles["menu-container"]}>
            <li>Update</li>
            <li onClick={() => setIsDelete(true)}>Delete</li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default CommentItemMenu;
