import PageContainer from "@/components/layouts/PageContainer"
import PostMenu from "@/features/posts/components/PostMenu"
import Posts from "@/features/posts/components/PostsContainer"

const IndexPage = () => {
  return (
    <PageContainer>
      <div className='space-y-6'>
        <PostMenu />
        <Posts />
      </div>
    </PageContainer>
  )
}

export default IndexPage