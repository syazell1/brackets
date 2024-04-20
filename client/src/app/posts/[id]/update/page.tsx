import { notFound } from 'next/navigation';
import { AxiosError } from 'axios';
import { client } from '@/lib/axios';
import { PostsDetails } from '@/features/posts/types/posts.types';
import PageContainer from '@/components/layouts/PageContainer';
import UpdatePostForm from '@/features/posts/components/UpdatePostForm';

type UpdatePostPageParamsType = {
  id: string
}

const UpdatePostPage = async ({ params }: { params: UpdatePostPageParamsType }) => {


  const res = await client.get<PostsDetails>(`/posts/${params.id}`)

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
