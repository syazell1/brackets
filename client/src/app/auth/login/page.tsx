import Container from "@/components/layout/Container"
import LoginForm from "@/features/Auth/components/LoginForm"
import AuthGuard from "@/providers/AuthGuard"

const LoginPage = () => {
    return (
        <Container className="pt-[20px]">
            <LoginForm />
        </Container>
    )
}

export default AuthGuard(LoginPage, false) 