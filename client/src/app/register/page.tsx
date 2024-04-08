import RegisterForm from '@/features/auth/components/RegisterForm';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/card';

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
