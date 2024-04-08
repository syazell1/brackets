import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import LoginForm from '@/features/auth/components/LoginForm';

const LoginPage = () => {
  return (
    <div className='max-w-xl mx-auto p-2 pt-16'>
      <Card>
        <CardHeader>
          <CardTitle>Sign In to brackets</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginPage;