import PageContainer from '@/components/layouts/PageContainer';
import styles from './page.module.css'
import PostMenu from '@/features/posts/components/PostMenu';
import PostsLists from '@/features/posts/components/PostsList';

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