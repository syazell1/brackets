'use client'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { PostsDetails } from '../types/posts.types'
// import './Markdown.css'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import UserPostInfo from '@/features/users/components/UserPostInfo'
import DeletePostDialog from './DeletePostDialog'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PostItemMenu from './PostItemMenu'

type PostDetailsType = {
  data: PostsDetails
}

const PostDetails = ({ data }: PostDetailsType) => {
  const [isDelete, setIsDelete] = useState(false)
  const router = useRouter(); 

  return (
    <>
      <DeletePostDialog isOpen={isDelete} setIsOpen={setIsDelete} postId={data.id} />
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          {/* <CardTitle>{data.title}</CardTitle> */}
          {/* <PostItemMenu data={data} /> */}
          <UserPostInfo username={data.owner.username} createdDate={data.created_at} />
          <PostItemMenu
            postId={data.id}
            username={data.owner.username} 
            setUpdateCommentHandler={() => router.push(`/posts/${data.id}/update`)}
            setDeleteCommentHandler={() => setIsDelete(true)}
            />
        </CardHeader>
        <CardContent>
          <CardTitle>{data.title}</CardTitle>
          <div className={`markdown-body prose light p-2 rounded-md`} style={{ marginTop: "30px" }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {data.content}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default PostDetails
