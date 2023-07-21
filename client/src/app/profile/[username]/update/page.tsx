import Container from "@/components/layout/Container"
import NavBar from "@/components/ui/nav-bar"
import UserProfileUpdateForm from "@/features/Users/components/UserProfileUpdateForm"
import AuthGuard from "@/providers/AuthGuard"

type UpdateUserProfilePageType = {
    username: string
}

const UpdateUserProfilePage = ({ params }: { params: UpdateUserProfilePageType }) => {
    return (
        <>
            <NavBar />
            <Container className="pt-[75px]">
                <div className="flex flex-col gap-2">
                    <UserProfileUpdateForm username={params.username} />
                </div>
            </Container>
        </>
    )
}



export default UpdateUserProfilePage;