import PageContainer from '@/components/layouts/PageContainer';
import PostMenu from '@/features/posts/components/PostMenu';
import PostsLists from '@/features/posts/components/PostsList';

const IndexPage = () => {
  return (
    <PageContainer>
      <div className='space-y-6'>
        <PostMenu />
        <PostsLists />
      </div>
    </PageContainer>
  )
}

export default IndexPage;