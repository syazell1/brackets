'use client'

import Card from "@/components/layout/Card";
import { useRegister } from "../hooks/useRegister";
import { FormEvent, createRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../schemas/authSchema";
import { RegisterUserInput } from "../types/Auth";

const RegisterForm = () => {
    const {register, handleSubmit, formState: {errors}} = useForm<RegisterUserInput>({
        resolver: zodResolver(registerSchema)
    })
    const {mutate, isLoading } = useRegister();

    const submitLogin = (data : RegisterUserInput) => {
        mutate(data)
    }

    return (
         <Card>
            <div className="flex flex-col gap-10 p-2">
                <h2 className="font-bold text-2xl">Create an Account</h2>
                <form onSubmit={handleSubmit(submitLogin)} className="flex flex-col gap-4">
                    <div>
                        <Input {...register("username")} type="text" placeholder="Username" />
                    </div>
                    <div>
                        <Input {...register("password")} type="password" placeholder="Password" />
                    </div>
                    <div className="mt-[35px]">
                        <Button type="submit">
                            {isLoading ? "Loading..." : "Login"}
                        </Button>
                    </div>
                    <div className="mr-auto mt-[10px]">
                        <p>Already Have an Account?  
                            <Link className="text-blue-500 font-semibold" href="/auth/login">Sign In Here</Link>
                        </p>
                    </div>
                </form>
            </div>
        </Card>
    );
}

export default RegisterForm