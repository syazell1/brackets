import Container from "@/components/layout/Container";
import UpdatePostForm from "@/features/Posts/components/UpdatePostForm";
import { getUser } from "@/providers/getCurrentUser";
import { redirect } from "next/navigation";

type PostDetailsPageParamsType = {
    id: string
}
const UpdatePostPage = async ({params}: {params: PostDetailsPageParamsType}) => {
        const user = await getUser();

        if (user == null )
            redirect('/')

    return (
        <Container className="pt-[20px]">
            <UpdatePostForm postId={params.id} />
        </Container>
    )
}

export default UpdatePostPage;