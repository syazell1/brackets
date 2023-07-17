import { ReactNode } from "react"
import { twMerge } from "tailwind-merge"

type CardType = {
    children?: ReactNode,
    class?: string
}

const Card = (props: CardType) => {
    const c = twMerge("bg-white p-4 shadow-md rounded-lg", props.class)

    return (
        <div className={c}>
           {props.children} 
        </div>
    )
}

export default Card