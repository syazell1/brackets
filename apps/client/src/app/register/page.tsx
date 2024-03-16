import Card from "client/components/layouts/Card";
import RegisterForm from "client/features/auth/components/RegisterForm";
import styles from './page.module.css'

const RegisterPage = () => {
  return (
    <div className={styles["register_page-container"]}>
      <Card>
        <RegisterForm />
      </Card>
    </div>
  )
}

export default RegisterPage;
