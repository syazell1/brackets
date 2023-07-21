import Container from "@/components/layout/Container";
import NavBar from "@/components/ui/nav-bar";
import CommentDetails from "@/features/Comments/components/CommentDetails";

type CommentDetailsPageType = {
    id: string
}

const CommentDetailsPage = ({ params }: { params: CommentDetailsPageType }) => {
    return (
        <>
            <NavBar />
            <Container className="pt-[75px]">
                <div className="flex flex-col gap-2">
                    <CommentDetails commentId={params.id} />
                </div>
            </Container>  
        </>
    )
}

export default CommentDetailsPage;