'use client'

import { MoreVertical } from "lucide-react";
import styles from './CommentItemMenu.module.css'

const CommentItemMenu = () => {
  return (
    <div className={styles.container}>
      <div className={styles["dropdown-btn"]}>
        <MoreVertical />
      </div>
      <div className={styles["dropdown-content"]}>
        <h4>Comments Menu</h4>
        <hr />
        <ul className={styles["menu-container"]}>
          <li>Update</li>
          <li>Delete</li>
        </ul>
      </div>
    </div>
  )
}

export default CommentItemMenu;
