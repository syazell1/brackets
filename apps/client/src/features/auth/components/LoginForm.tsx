'use client'

import Button from "client/components/ui/Button"
import Input from "client/components/ui/Input"
import styles from './LoginForm.module.css'
import { useForm } from "react-hook-form"
import { useLogin } from "../hooks/useLogin"
import { zodResolver } from '@hookform/resolvers/zod'
import { loginInputSchema } from "../schemas/auth.schema"
import { LoginInput } from "../types/auth.types"
import ErrorMessage from "client/components/ui/ErrorMessage"
import Link from "next/link"
import { useContext, useEffect } from "react"
import { authContextProvider } from "client/providers/AuthContext"
import { useRouter } from "next/navigation"

const LoginForm = () => {
  const { mutate, isPending } = useLogin();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginInputSchema)
  });
  const { isLoggedIn } = useContext(authContextProvider)
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/')
    }
  }, [isLoggedIn])

  const submitLoginHandler = (data: LoginInput) => {
    mutate(data)
  }

  return (
    <form onSubmit={handleSubmit(submitLoginHandler)} className={styles["form-container"]}>
      <div className={styles.title}>
        <h2>Sign in to brackets</h2>
      </div>
      <div className={styles["form-input"]}>
        <Input {...register("username")} placeholder="Username" />
        {errors.username?.message && <ErrorMessage message={errors.username.message!} />}
      </div>
      <div className={styles["form-input"]}>
        <Input {...register("password")} placeholder="Password" type="password" />
        {errors.password?.message && <ErrorMessage message={errors.password.message!} />}
        <a className={styles["forgot-pass"]}
          href="#">Forgot Password?</a>
      </div>
      <div className={styles["form-control"]}>
        <Button
          variant="primary"
          type="submit">
          {isPending ? "Loading..." : "Sign In"}
        </Button>
      </div>
      <div className={styles["sign-up"]}>
        <p>Don't have an account? <Link href="/register">Sign up Now</Link>
        </p>
      </div>
    </form>
  )
}

export default LoginForm;
