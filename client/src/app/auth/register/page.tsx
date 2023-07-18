import Container from "@/components/layout/Container"
import RegisterForm from "@/features/Auth/components/RegisterForm"
import AuthGuard from "@/providers/AuthGuard"

const RegisterPage = () => {
    return (
        <Container className="pt-[20px]">
            <RegisterForm />
        </Container>
    )
}

export default AuthGuard(RegisterPage, false) 