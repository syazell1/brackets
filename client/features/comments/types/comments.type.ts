export interface CommentsData {
  id: string,
  content: string,
  likes_count: number,
  created_at: string,
  owner: Owner
}

interface Owner {
  id: string,
  username: string
}
