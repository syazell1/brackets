'use client'

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ReactNode } from "react";

type UserDialogType = {
    children: ReactNode,
    title: string,
    message?: string,
    actionHandler?: () => void 
}

const MessageDialog = (props: UserDialogType) => {
    return (
        <>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    {props.children}
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{props.title}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {props.message}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={props.actionHandler}>Continue</AlertDialogAction>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default MessageDialog;