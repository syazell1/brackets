import { ButtonHTMLAttributes, forwardRef } from "react";
import styles from './Button.module.css'

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: "primary" | "secondary"
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant, ...props }, ref) => {
    let btnStyle = `${styles.btn} `

    variant == "primary" ? btnStyle += styles.primary : ""
    variant == "secondary" ? btnStyle += styles.seconary : ""

    return (
      <button {...props}
        className={`${btnStyle}`}
        ref={ref}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = "Button";

export default Button;
