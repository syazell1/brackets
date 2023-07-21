import Container from "@/components/layout/Container";
import UpdatePostForm from "@/features/Posts/components/UpdatePostForm";

type PostDetailsPageParamsType = {
    id: string
}
const UpdatePostPage = ({params}: {params: PostDetailsPageParamsType}) => {
    console.log(params.id);

    return (
        <Container className="pt-[20px]">
            <UpdatePostForm postId={params.id} />
        </Container>
    )
}

export default UpdatePostPage;