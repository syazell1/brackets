import Card from '@/components/layouts/Card';
import LoginForm from '@/features/auth/components/LoginForm';

const LoginPage = () => {
  return (
    <div className='max-w-xl mx-auto p-2 pt-16'>
      <Card>
          <LoginForm />
      </Card>
    </div>
  )
}

export default LoginPage;
