import Container from "@/components/layout/Container"
import RegisterForm from "@/features/Auth/components/RegisterForm"
import { getUser } from "@/providers/getCurrentUser";
import { redirect } from "next/navigation";

const RegisterPage = async () => {

    const data = await getUser();

    if(data != null)
        redirect("/")



    return (
        <Container className="pt-[20px]">
            <RegisterForm />
        </Container>
    )
}

export default RegisterPage 