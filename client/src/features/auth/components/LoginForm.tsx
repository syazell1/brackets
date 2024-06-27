'use client'

import { useForm } from "react-hook-form"
import { useLogin } from "../hooks/useLogin"
import { zodResolver } from '@hookform/resolvers/zod'
import { loginInputSchema } from "../schemas/auth.schema"
import { LoginInput } from "../types/auth.types"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ErrorMessage from "@/components/ui/ErrorMessage"
import { isAxiosError } from "axios"
import { ErrorResponse } from "@/types/error-response"

const LoginForm = () => {
  const { mutate, isPending, error} = useLogin();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginInputSchema)
  });

  const submitLoginHandler = (data: LoginInput) => {
    mutate(data)
  }

  return (
    <form onSubmit={handleSubmit(submitLoginHandler)} className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Input {...register("username")} placeholder="Username" />
        {errors.username?.message && <ErrorMessage message={errors.username.message!} />}
      </div>
      <div className="flex flex-col gap-2">
        <Input {...register("password")} placeholder="Password" type="password" />
        {errors.password?.message && <ErrorMessage message={errors.password.message!} />}
        <a className="text-sm no-underline font-semibold text-[#444]"
          href="#">Forgot Password?</a>
      </div>
      <div className="mt-2">
        <Button
          className="w-full"
          type="submit">
          {isPending ? "Loading..." : "Sign In"}
        </Button>
        {isAxiosError<ErrorResponse>(error) && <ErrorMessage message={error.response?.data.message!} />}
      </div>
      <div className="font-semibold text-center">
        <p>Don&apos;t have an account? <Link href="/register" className="text-blue-400">Sign up Now</Link>
        </p>
      </div>
    </form>
  )
}

export default LoginForm;
