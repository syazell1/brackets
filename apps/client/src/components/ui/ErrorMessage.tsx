import styles from './ErrorMessage.module.css'

type ErrorMessageType = {
  message: String
}

const ErrorMessage = ({ message }: ErrorMessageType) => {
  return <p className={styles.error}>{message}</p>
}

export default ErrorMessage;
