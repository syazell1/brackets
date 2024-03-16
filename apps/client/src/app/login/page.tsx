import Card from '@/components/layouts/Card';
import styles from './page.module.css'
import LoginForm from '@/features/auth/components/LoginForm';

const LoginPage = () => {
  return (
    <div className={styles["login_page-container"]}>
      <Card>
        <LoginForm />
      </Card>
    </div>
  )
}

export default LoginPage;
