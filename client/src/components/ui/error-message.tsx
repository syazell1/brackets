type ErrorMessageType = {
    message?: string
}


export const ErrorMessage= ({message} : ErrorMessageType) => {
    return <p className="text-sm text-muted-foreground text-red-500 mt-2"> {message}</p>
}