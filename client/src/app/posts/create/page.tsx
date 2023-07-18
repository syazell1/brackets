import Container from "@/components/layout/Container"
import CreatePostForm from "@/features/Posts/components/CreatePostForm"
import AuthGuard from "@/providers/AuthGuard";


const CreatePostPage = () => {
    return (
        <Container className="pt-[20px]">
            <CreatePostForm />
        </Container>
    );
}

export default AuthGuard(CreatePostPage);