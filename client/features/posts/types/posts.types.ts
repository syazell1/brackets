export interface PostsDetails {
  id: string,
  title: string,
  content: string,
  created_at: string,
  likes_count: number,
  comments_count: number,
  owner: PostsOwner
}

interface PostsOwner {
  id: string,
  username: string
}
