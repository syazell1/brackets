'use client'
import Card from 'client/components/layouts/Card'
import styles from './PostDetails.module.css'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { PostsDetails } from '../types/posts.types'
import './Markdown.css'
import PostItemMenu from './PostItemMenu'

type PostDetailsType = {
  data: PostsDetails
}

const PostDetails = ({ data }: PostDetailsType) => {
  return (
    <Card>
      <div>
        <header className={styles["header-container"]}>
          <h2>{data.title}</h2>
          <PostItemMenu data={data} />
        </header>
        <main>
          <div className={`markdown-body ${styles["markdown-content"]}`} style={{ marginTop: "30px" }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {data.content}
            </ReactMarkdown>
          </div>
        </main>
        <footer>
        </footer>
      </div>
    </Card>
  )
}

export default PostDetails
