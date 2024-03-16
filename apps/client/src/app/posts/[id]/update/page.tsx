import { notFound } from 'next/navigation';
import styles from './UpdatePostPage.module.css'
import { AxiosError } from 'axios';
import client from 'client/libs/axios';
import { PostsDetails } from 'client/features/posts/types/posts.types';
import { POSTS_URL } from 'client/constants/server-config';
import UpdatePostForm from 'client/features/posts/components/UpdatePostForm';
import PageContainer from 'client/components/layouts/PageContainer';

type UpdatePostPageParamsType = {
  id: string
}

const UpdatePostPage = async ({ params }: { params: UpdatePostPageParamsType }) => {


  const res = await client.get<PostsDetails>(`${POSTS_URL}/${params.id}`)

  if (res instanceof AxiosError && res.status === 404) {
    notFound();
  }

  return (
    <PageContainer>
      <UpdatePostForm data={res.data} />
    </PageContainer>
  )
}

export default UpdatePostPage
