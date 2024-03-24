'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { registerInputSchema } from "../schemas/auth.schema"
import { RegisterInput } from "../types/auth.types"
import Link from "next/link"
import { useRegister } from "../hooks/useRegister"
import { Input } from '@repo/ui/components/input'
import { Button } from '@repo/ui/components/button'
import ErrorMessage from '@repo/ui/components/ErrorMessage'

const RegisterForm = () => {
  const { mutate, isPending } = useRegister();
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(registerInputSchema)
  });

  const submitRegisterHandler = (data: RegisterInput) => {
    mutate(data)
  }

  return (
    <form onSubmit={handleSubmit(submitRegisterHandler)} className="flex flex-col gap-8">
      <div>
        <h2 className="font-bold text-center text-2xl">Sign up to brackets</h2>
      </div>
      <div className="flex flex-col gap-2">
        <Input {...register("username")} placeholder="Username" />
        {errors.username?.message && <ErrorMessage message={errors.username.message!} />}
      </div>
      <div className="flex flex-col gap-2">
        <Input {...register("password")} placeholder="Password" type="password" />
        {errors.password?.message && <ErrorMessage message={errors.password.message!} />}
      </div>
      <div>
        <div className="flex gap-2">
          <div className="flex-1">
            <Input {...register("first_name")} placeholder="First Name" />
            {errors.first_name?.message && <ErrorMessage message={errors.first_name.message!} />}
          </div>
          <div className="flex-1">
            <Input {...register("last_name")} placeholder="Last Name" />
            {errors.last_name?.message && <ErrorMessage message={errors.last_name.message!} />}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Input {...register("email")} type="email" placeholder="Email" />
        {errors.email?.message && <ErrorMessage message={errors.email.message!} />}
      </div>
      <div className="mt-6">
        <Button
          className="w-full"
          type="submit">
          {isPending ? "Loading..." : "Sign Up"}
        </Button>
      </div>
      <div className="font-semibold text-center">
        <p>Already have an account? <Link href="/login" className="text-blue-400">Sign In Now</Link>
        </p>
      </div>
    </form>
  )
}

export default RegisterForm;
