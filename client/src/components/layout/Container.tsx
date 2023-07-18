import { ReactNode } from "react"
import { twMerge } from "tailwind-merge"

type ContainerType = {
    children?: ReactNode,
    className?: string
}

const Container  = (props : ContainerType) => {
    const c = twMerge("max-w-2xl mx-auto min-h-screen px-2 py-11", props.className)

    return (
        <main className={c}>
            {props.children}
        </main>
    )
}

export default Container