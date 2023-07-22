import Container from "@/components/layout/Container";
import NavBar from "@/components/ui/nav-bar";
import { Separator } from "@/components/ui/separator";
import { POSTS_URL } from "@/constants/server-config";
import AddCommentForm from "@/features/Comments/components/AddCommentForm";
import PostCommentsList from "@/features/Comments/components/PostCommentsList";
import PostDetails from "@/features/Posts/components/PostDetails";
import type { PostDetails as TPostDetails } from "@/features/Posts/types/Posts";
import client from "@/lib/axios";
import { AxiosError } from "axios";
import { notFound } from "next/navigation";

type PostDetailsPageParamsType = {
    id: string
}

const PostDetailsPage = async ({ params }: { params: PostDetailsPageParamsType }) => {
    const res = await client.get<TPostDetails>(`${POSTS_URL}/${params.id}`);

    if(res instanceof AxiosError && res.response?.status == 404)
        notFound()

    return (
        <>
            <NavBar />
            <Container className="pt-[75px]">
                <div className="flex flex-col gap-2">
                    <PostDetails data={res.data} />

                    <Separator className="my-2" />
                    <h2 className="font-semibold text-lg">Comments</h2>
                    <AddCommentForm postId={params.id} /> 
                    <PostCommentsList postId={params.id} />
                </div>
            </Container>
        </>
    );
}

export default PostDetailsPage;