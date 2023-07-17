import Container from "@/components/layout/Container"
import CreatePostForm from "@/features/Posts/components/CreatePostForm"

const CreatePostPage = () => {
    return (
        <Container className="pt-[20px]">
            <CreatePostForm />
        </Container>
    );
}

export default CreatePostPage;