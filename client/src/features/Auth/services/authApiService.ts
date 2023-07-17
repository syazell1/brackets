import client, { auth_client } from '@/lib/axios';
import { AuthDetails, LoginUserInput, RegisterUserInput } from '../types/Auth';
import { AUTH_URL } from '@/constants/server-config';
import { UserInfo } from '@/features/Users/types/Users';

export const loginUser = async (loginUserInput: LoginUserInput) => {
    const res = await auth_client.post<AuthDetails>(`${AUTH_URL}/login`, loginUserInput);

    return res.data;
}

export const registerUser = async (registerUserInput : RegisterUserInput) => {
    const res = await auth_client.post<AuthDetails>(`${AUTH_URL}/register`, registerUserInput);

    return res.data;
}

export const getCurrentUser = async () => {
    const res = await client.get<UserInfo>(`${AUTH_URL}/users`);

    return res.data;
}



export const logoutUser = async () => {
    const res = await client.post(`${AUTH_URL}/logout`);

    return res.data;
}

