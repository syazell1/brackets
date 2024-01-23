import PageContainer from "client/components/layouts/PageContainer";
import PostMenu from "client/features/posts/components/PostMenu";
import PostsLists from "client/features/posts/components/PostsList";
import styles from './page.module.css'

const IndexPage = () => {
  return (
    <PageContainer>
      <div className={styles["post-container"]}>
        <PostMenu />
        <PostsLists />
      </div>
    </PageContainer>
  )
}

export default IndexPage;
