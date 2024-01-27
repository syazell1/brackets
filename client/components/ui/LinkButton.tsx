import Link, { LinkProps } from 'next/link'
import { ReactNode, forwardRef } from 'react'
import styles from './LinkButton.module.css'

interface LinkButtonProps extends LinkProps {
  children: ReactNode
}
const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(
  (props, ref) => {
    return (
      <Link {...props} className={`${styles.btn} ${styles.primary}`} ref={ref}>
        {props.children}
      </Link>
    )
  }
)

LinkButton.displayName = "LinkButton"

export default LinkButton;
