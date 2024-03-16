import { AxiosError } from "axios"
import PageContainer from "client/components/layouts/PageContainer"
import { POSTS_URL } from "client/constants/server-config"
import CommentsList from "client/features/comments/components/CommentsList"
import PostDetails from "client/features/posts/components/PostDetails"
import { PostsDetails } from "client/features/posts/types/posts.types"
import client from "client/libs/axios"
import { notFound } from "next/navigation"
import styles from './PostDetailsPage.module.css'

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
