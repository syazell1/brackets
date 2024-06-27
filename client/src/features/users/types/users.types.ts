export interface UsersInfo {
  id: string,
  username: string
}

export interface UserDetails extends UsersInfo {
  first_name: string,
  last_name: string,
  email: string 
  bio: null | string,
  created_at: string 
}