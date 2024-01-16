import Card from "client/components/layouts/Card";
import LoginForm from "client/features/auth/components/LoginForm";
import styles from './page.module.css'

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
