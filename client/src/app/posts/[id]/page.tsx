import Container from "@/components/layout/Container";
import NavBar from "@/components/ui/nav-bar";
import { Separator } from "@/components/ui/separator";
import AddCommentForm from "@/features/Comments/components/AddCommentForm";
import PostCommentsList from "@/features/Comments/components/PostCommentsList";
import PostDetails from "@/features/Posts/components/PostDetails";

type PostDetailsPageParamsType = {
    id: string
}

const PostDetailsPage = ({ params }: { params: PostDetailsPageParamsType }) => {

    return (
        <>
            <NavBar />
            <Container className="pt-[75px]">
                <div className="flex flex-col gap-2">
                    <PostDetails id={params.id} />

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