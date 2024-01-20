import PageContainer from "client/components/layouts/PageContainer";
import AddPostForm from "client/features/posts/components/AddPostForm";
import PostsLists from "client/features/posts/components/PostsList";
import Link from "next/link";

const IndexPage = () => {
  return (
    <PageContainer>
      <div>
        <Link href="/posts/create">Add Post</Link>
      </div>
      <PostsLists />
    </PageContainer>
  )
}

export default IndexPage;
