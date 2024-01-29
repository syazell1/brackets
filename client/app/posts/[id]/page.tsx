import { AxiosError } from "axios"
import PageContainer from "client/components/layouts/PageContainer"
import { POSTS_URL } from "client/constants/server-config"
import PostDetails from "client/features/posts/components/PostDetails"
import { PostsDetails } from "client/features/posts/types/posts.types"
import client from "client/libs/axios"
import { notFound } from "next/navigation"

type PageDetailsPageParamsType = {
  id: string
}

const PageDetailsPage = async ({ params }: { params: PageDetailsPageParamsType }) => {
  const res = await client.get<PostsDetails>(`${POSTS_URL}/${params.id}`)

  if (res instanceof AxiosError && res.status === 404) {
    notFound();
  }

  return (
    <PageContainer>
      <PostDetails data={res.data} />
    </PageContainer>
  )
}

export default PageDetailsPage;
