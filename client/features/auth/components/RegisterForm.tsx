'use client'

import Button from "client/components/ui/Button"
import Input from "client/components/ui/Input"
import styles from './RegisterForm.module.css'
import { useForm } from "react-hook-form"
import { useLogin } from "../hooks/useLogin"
import { zodResolver } from '@hookform/resolvers/zod'
import { loginInputSchema, registerInputSchema } from "../schemas/auth.schema"
import { LoginInput, RegisterInput } from "../types/auth.types"
import ErrorMessage from "client/components/ui/ErrorMessage"
import Link from "next/link"
import { useRegister } from "../hooks/useRegister"

const RegisterForm = () => {
  const { mutate, isPending } = useRegister();
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(registerInputSchema)
  });

  const submitRegisterHandler = (data: RegisterInput) => {
    mutate(data)
  }

  return (
    <form onSubmit={handleSubmit(submitRegisterHandler)} className={styles["form-container"]}>
      <div className={styles.title}>
        <h2>Sign up to brackets</h2>
      </div>
      <div className={styles["form-input"]}>
        <Input {...register("username")} placeholder="Username" />
        {errors.username?.message && <ErrorMessage message={errors.username.message!} />}
      </div>
      <div className={styles["form-input"]}>
        <Input {...register("password")} placeholder="Password" type="password" />
        {errors.password?.message && <ErrorMessage message={errors.password.message!} />}
      </div>
      <div>
        <div className={styles["form-details"]}>
          <div>
            <Input {...register("first_name")} placeholder="First Name" />
            {errors.first_name?.message && <ErrorMessage message={errors.first_name.message!} />}
          </div>
          <div>
            <Input {...register("last_name")} placeholder="Last Name" />
            {errors.last_name?.message && <ErrorMessage message={errors.last_name.message!} />}
          </div>
        </div>
        <div>
          <Input {...register("email")} type="email" placeholder="Email" />
          {errors.email?.message && <ErrorMessage message={errors.email.message!} />}
        </div>
      </div>
      <div className={styles["form-control"]}>
        <Button
          variant="primary"
          type="submit">
          {isPending ? "Loading..." : "Sign Up"}
        </Button>
      </div>
      <div className={styles["sign-up"]}>
        <p>Already have an account? <Link href="/login">Sign In Now</Link>
        </p>
      </div>
    </form>
  )
}

export default RegisterForm;
