import styles from './PostDetailsPage.module.css'
import { POSTS_URL } from "@/constants/server-config"
import PageContainer from "@/components/layouts/PageContainer"
import PostDetails from "@/features/posts/components/PostDetails"
import { notFound } from 'next/navigation'
import CommentsContainer from '@/features/comments/components/CommentsContainer'
import { PostsDetails } from '@/features/posts/types/posts.types'

type PostDetailsPageParamsType = {
  id: string
}

export const revalidate = 1;

const PostDetailsPage = async ({ params }: { params: PostDetailsPageParamsType }) => {
  const res = await fetch(`${POSTS_URL}/${params.id}`, {cache: "no-store"})
  if(res.status === 404) {
    notFound();
  }

  const data = await res.json() as PostsDetails

  return (
    <PageContainer>
      <div className={styles.container}>
        <PostDetails data={data} />
        {/* <CommentsList postId={data.id} /> */}
        <CommentsContainer postId={data.id} />
      </div>
    </PageContainer>
  )
}

export default PostDetailsPage;
