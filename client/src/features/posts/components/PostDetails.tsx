'use client'
import styles from './PostDetails.module.css'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { PostsDetails } from '../types/posts.types'
import './Markdown.css'
import PostItemMenu from './PostItemMenu'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

type PostDetailsType = {
  data: PostsDetails
}

const PostDetails = ({ data }: PostDetailsType) => {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle>{data.title}</CardTitle>
        <PostItemMenu data={data} />
      </CardHeader>
      <CardContent>
        <div className={`markdown-body prose light ${styles["markdown-content"]} rounded-md`} style={{ marginTop: "30px" }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {data.content}
          </ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  )
}

export default PostDetails
