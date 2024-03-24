import Card from '@/components/layouts/Card';
import RegisterForm from '@/features/auth/components/RegisterForm';

const RegisterPage = () => {
  return (
    <div className="max-w-xl mx-auto pt-16">
      <Card>
        <RegisterForm />
      </Card>
    </div>
  )
}

export default RegisterPage;
