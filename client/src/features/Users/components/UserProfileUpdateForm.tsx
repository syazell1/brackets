'use client'

import Card from "@/components/layout/Card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useGetUserDetails } from "../hooks/useGetUserDetails"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { UserUpdateDetailsInput } from "../types/Users"
import { userUpdateDetailsSchema } from "../schemas/userSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Textarea } from "@/components/ui/textarea"
import { useEffect } from "react"
import { useUpdateUserDetails } from "../hooks/useUpdateUserDetails"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

type UserProfileUpdateFormType = {
    username: string
}

const UserProfileUpdateForm = ({ username }: UserProfileUpdateFormType) => {
    const router = useRouter();
    const { data, isSuccess } = useGetUserDetails(username);
    const { handleSubmit, register, setValue, formState } = useForm<UserUpdateDetailsInput>({
        resolver: zodResolver(userUpdateDetailsSchema)
    });
    const { mutate, isLoading } = useUpdateUserDetails(username);


    const submitHandler = (data: UserUpdateDetailsInput) => {
        mutate(data);
    }

    useEffect(() => {
        if (isSuccess) {
            setValue("username", data.username)
            setValue("firstName", data.firstName)
            setValue("lastName", data.lastName)
            setValue("bio", data.bio)
            setValue("email", data.email)
        }
    }, [isSuccess])


    if (!data)
        return <p>Loading...</p>

    return (
        <Card>
            <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-4 items-center">
                    <Avatar className="w-[100px] h-[100px]">
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </div>
                {/* Users Info */}
                <div className="">
                    <form onSubmit={handleSubmit(submitHandler)} className="flex flex-col gap-4">
                        <div>
                            <Label htmlFor="username">Userame</Label>
                            <Input id="username" {...register("username")} />
                        </div>
                        <div>
                            <Label htmlFor="terms">Bio</Label>
                            <Textarea {...register("bio")} />
                        </div>
                        <div className="flex flex-wrap  items-center justify-between">
                            <div className="w-full">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input className="w-full" id="firstName" {...register("firstName")} />
                            </div>
                            <div className="w-full">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input className="w-full" id="lastName" {...register("lastName")} />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input type="email" id="email" {...register("email")} />
                        </div>
                        <div className="mt-[35px] flex justify-between">
                                <Button type="submit">
                                    {isLoading ? "Loading..." : "Submit Content"}
                                </Button>
                            <Button type="button" onClick={() => { router.push('/') }}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </Card>
    )
}

export default UserProfileUpdateForm