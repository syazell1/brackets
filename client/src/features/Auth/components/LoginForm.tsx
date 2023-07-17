'use client'

import Card from "@/components/layout/Card";
import { useLogin } from "../hooks/useLogin";
import { Input } from "@/components/ui/input";
import { FormEvent, createRef, useRef } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { LoginUserInput } from "../types/Auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schemas/authSchema";
import { ErrorMessage } from "@/components/ui/error-message";

const LoginForm = () => {
    const {mutate, isLoading} = useLogin();
    const {register, handleSubmit, formState: {errors}} = useForm<LoginUserInput>({
        resolver: zodResolver(loginSchema)
    })

    const submitLogin = (data: LoginUserInput) => {
        mutate(data)
    }

    return (
        <Card>
            <div className="flex flex-col gap-10 p-2">
                <h2 className="font-bold text-2xl">Login</h2>
                <form onSubmit={handleSubmit(submitLogin)} className="flex flex-col gap-4">
                    <div>
                        <Input {...register("username")} type="text" placeholder="Username" />
                        {errors.username && (<ErrorMessage message={errors.username.message} />)}
                    </div>
                    <div>
                        <Input {...register("password")} type="password" placeholder="Password" />
                        {errors.password && (<ErrorMessage message={errors.password.message} />)}
                    </div>
                    <div className="mt-[35px]">
                        <Button type="submit">
                            {isLoading ? "Loading..." : "Login"}
                        </Button>
                    </div>
                    <div className="mr-auto mt-[10px]">
                        <p>Dont you have an account?  
                            <Link className="text-blue-500 font-semibold" href="/auth/register">Sign Up Here</Link>
                        </p>
                    </div>
                </form>
            </div>
        </Card>
    );
}

export default LoginForm