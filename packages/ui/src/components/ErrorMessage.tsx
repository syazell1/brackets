type ErrorMessageType = {
  message: String
}

const ErrorMessage = ({ message }: ErrorMessageType) => {
  return <p className="text-red-500 text-sm font-semibold">{message}</p>
}

export default ErrorMessage;
