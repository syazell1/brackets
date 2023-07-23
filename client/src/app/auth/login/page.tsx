import Container from "@/components/layout/Container"
import LoginForm from "@/features/Auth/components/LoginForm"
import { getUser } from "@/providers/getCurrentUser"
import { redirect } from "next/navigation"

const LoginPage = async () => {

    const data = await getUser();

    if(data != null)
        redirect("/")

    return (
        <Container className="pt-[20px]">
            <LoginForm />
        </Container>
    )
}

export default LoginPage