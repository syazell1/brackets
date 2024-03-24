type ErrorMessageType = {
  message: String
}

const ErrorMessage = ({ message }: ErrorMessageType) => {
  return <p className="bg-red-500 font-semibold">{message}</p>
}

export default ErrorMessage;
