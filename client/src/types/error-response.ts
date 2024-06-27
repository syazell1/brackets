type ErrorType = "NotFoundError";


export interface ErrorResponse {
  error_type: ErrorType,
  status_code: number,
  message: string
}
