import Card from "@/components/layout/Card"
import { PostCommentInfo } from "../types/Comments"
import Link from "next/link"

type PostCommentDetailsType = {
    data : PostCommentInfo 
}

const PostCommentDetails = ({data} :PostCommentDetailsType) => {
    return (
        <Card>
            <h2 className="text-lg font-semibold">Comment from the discussion of: <Link href={`/posts/${data.id}`} className="hover:underline">
                {data.title}</Link>
            </h2>
        </Card>
    )
}

export default PostCommentDetails;