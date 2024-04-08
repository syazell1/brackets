'use client'

import { createPortal } from 'react-dom';
import styles from './Modal.module.css'
import { ReactNode } from 'react';

type ModalType = {
  title: string,
  closeHandler: () => void
  children: ReactNode
}

const Modal = (props: ModalType) => {
  return createPortal(
    <div className={styles.backdrop} onClick={props.closeHandler}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <header>
          <h2>{props.title}</h2>
        </header>
        <main className={styles.content}>
          {props.children}
        </main>
      </div>
    </div>,
    document.getElementById("modal-root")!
  )
}

export default Modal;
