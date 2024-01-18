import PageContainer from "client/components/layouts/PageContainer";
import PostsLists from "client/features/posts/components/PostsList";

const IndexPage = () => {
  return (
    <PageContainer>
      <PostsLists />
    </PageContainer>
  )
}

export default IndexPage;
