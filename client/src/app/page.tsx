import Container from "@/components/layout/Container"
import { Button } from "@/components/ui/button"
import NavBar from "@/components/ui/nav-bar"
import { Separator } from "@/components/ui/separator"
import CreatePostButton from "@/features/Posts/components/CreatePostButton"
import PostsList from "@/features/Posts/components/PostsList"

const IndexPage = () => {
  return (
    <>
      <NavBar />
      <Container className="pt-[75px]">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center gap-4">
            <h2 className="text-lg font-semibold">Latest Posts</h2>
            <CreatePostButton />
          </div>
          <Separator className="my-4" />
          <PostsList />
        </div> 
      </Container>
    </>
  )
}

export default IndexPage