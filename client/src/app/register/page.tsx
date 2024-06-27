import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import RegisterForm from '@/features/auth/components/RegisterForm';

const RegisterPage = () => {
  return (
    <div className="max-w-xl mx-auto pt-16">
      <Card>
        <CardHeader>
          <CardTitle>Sign Up to brackets</CardTitle> 
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  )
}

export default RegisterPage;
