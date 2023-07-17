import Container from "@/components/layout/Container";
import NavBar from "@/components/ui/nav-bar";
import PostDetails from "@/features/Posts/components/PostDetails";

type PostDetailsPageParamsType = {
    id: string
}

const PostDetailsPage = ({ params }: { params: PostDetailsPageParamsType }) => {
    console.log(params.id)

    return (
        <>
            <NavBar />
            <Container className="pt-[75px]">
                <PostDetails id={params.id} />
            </Container>
        </>
    );
}

export default PostDetailsPage;