'use client'

import { MoreVertical } from "lucide-react";
import styles from './PostItemMenu.module.css'

const PostItemMenu = () => {
  return (
    <div className={styles.container}>
      <div className={styles["dropdown-btn"]}>
        <MoreVertical />
      </div>
      <div className={styles["dropdown-content"]}>
        <h4>Post Menu</h4>
        <hr />
        <ul className={styles["menu-container"]}>
          <li>Copy Link</li>
          <li>Update</li>
          <li>Delete</li>
        </ul>
      </div>
    </div>
  )
}

export default PostItemMenu;
