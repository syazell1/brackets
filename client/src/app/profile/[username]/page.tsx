import Container from "@/components/layout/Container";
import NavBar from "@/components/ui/nav-bar";
import UsersPostsList from "@/features/Posts/components/UsersPostsList";

type UsersPostPageParamsType = {
    username: string
}

const UsersPostsPage = ({ params }: { params: UsersPostPageParamsType}) => {
    
    return (
        <>
            <NavBar />
            <Container className="pt-[75px]">
                <div className="flex flex-col gap-4">
                    <UsersPostsList username={params.username} />
                </div>
            </Container>
        </>
    );
}

export default UsersPostsPage;