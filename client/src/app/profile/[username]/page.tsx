import Container from "@/components/layout/Container";
import NavBar from "@/components/ui/nav-bar";
import { Separator } from "@/components/ui/separator";
import UsersPosts from "@/features/Posts/components/UsersPosts";
import UsersPostsList from "@/features/Posts/components/UsersPostsList";
import UserProfileDetails from "@/features/Users/components/UsersProfileDetails";

type UsersPostPageParamsType = {
    username: string
}

const UsersPostsPage = ({ params }: { params: UsersPostPageParamsType }) => {

    return (
        <>
            <NavBar />
            <Container className="pt-[75px]">
                <div className="flex flex-col gap-2">
                    <UserProfileDetails username={params.username} />
                    <UsersPosts username={params.username} /> 
                </div>
            </Container>
        </>
    );
}

export default UsersPostsPage;