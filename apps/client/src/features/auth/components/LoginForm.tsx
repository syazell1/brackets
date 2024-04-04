'use client'

import {Button} from "@repo/ui/components/button";
import {Input} from "@repo/ui/components/input";
import { useForm } from "react-hook-form"
import { useLogin } from "../hooks/useLogin"
import { zodResolver } from '@hookform/resolvers/zod'
import { loginInputSchema } from "../schemas/auth.schema"
import { LoginInput } from "../types/auth.types"
import ErrorMessage from "@repo/ui/components/ErrorMessage";
import Link from "next/link"
import { useContext, useEffect } from "react"
import { useRouter } from "next/navigation"
import { authContextProvider } from "@/providers/AuthContext";

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
      </div>
      <div className="font-semibold text-center">
        <p>Don't have an account? <Link href="/register" className="text-blue-400">Sign up Now</Link>
        </p>
      </div>
    </form>
  )
}

export default LoginForm;
