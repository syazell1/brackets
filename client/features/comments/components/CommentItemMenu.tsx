'use client'

import { MoreVertical } from "lucide-react";
import styles from './CommentItemMenu.module.css'

type CommentItemMenuType = {
  setUpdateCommentHandler: () => void,
  setDeleteCommentHandler: () => void
}

const CommentItemMenu = ({ setDeleteCommentHandler, setUpdateCommentHandler }: CommentItemMenuType) => {

  return (
    <>
      <div className={styles.container}>
        <div className={styles["dropdown-btn"]}>
          <MoreVertical />
        </div>
        <div className={styles["dropdown-content"]}>
          <h4>Comments Menu</h4>
          <hr />
          <ul className={styles["menu-container"]}>
            <li onClick={setUpdateCommentHandler}>Update</li>
            <li onClick={setDeleteCommentHandler}>Delete</li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default CommentItemMenu;
