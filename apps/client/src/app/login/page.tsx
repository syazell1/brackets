import LoginForm from '@/features/auth/components/LoginForm';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/card';

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