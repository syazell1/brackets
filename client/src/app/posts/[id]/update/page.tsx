import { notFound } from 'next/navigation';
import { PostsDetails } from '@/features/posts/types/posts.types';
import PageContainer from '@/components/layouts/PageContainer';
import UpdatePostForm from '@/features/posts/components/UpdatePostForm';
import { POSTS_URL } from '@/constants/server-config';

type UpdatePostPageParamsType = {
  id: string
}

export const revalidate = 1;

// TODO: move this fetching to client 
const UpdatePostPage = async ({ params }: { params: UpdatePostPageParamsType }) => {
  const res = await fetch(`${POSTS_URL}/${params.id}`, {cache: "no-store"})
  if(res.status === 404) {
    notFound();
  }

  const data = await res.json() as PostsDetails
  return (
    <PageContainer>
      <UpdatePostForm data={data} />
    </PageContainer>
  )
}

export default UpdatePostPage