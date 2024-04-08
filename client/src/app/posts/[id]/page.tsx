import { AxiosError } from "axios"
import { notFound } from "next/navigation"
import styles from './PostDetailsPage.module.css'
import client from "@/lib/axios"
import { PostsDetails } from "@/features/posts/types/posts.types"
import { POSTS_URL } from "@/constants/server-config"
import PageContainer from "@/components/layouts/PageContainer"
import PostDetails from "@/features/posts/components/PostDetails"
import CommentsList from "@/features/comments/components/CommentsList"

type PostDetailsPageParamsType = {
  id: string
}

const PostDetailsPage = async ({ params }: { params: PostDetailsPageParamsType }) => {
  const res = await client.get<PostsDetails>(`${POSTS_URL}/${params.id}`)

  if (res instanceof AxiosError && res.status === 404) {
    notFound();
  }

  return (
    <PageContainer>
      <div className={styles.container}>
        <PostDetails data={res.data} />
        <CommentsList postId={res.data.id} />
      </div>
    </PageContainer>
  )
}

export default PostDetailsPage;
