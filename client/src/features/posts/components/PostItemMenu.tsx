import {
  MoreHorizontal,
  Trash2,
  Pencil,
  Copy
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import toast from "react-hot-toast";
import { authStore } from "@/providers/AuthStore";
import Link from "next/link";

type PostItemMenuType = {
  postId : string,
  username : string,
  setDeleteCommentHandler: () => void
}
const PostItemMenu = (props : PostItemMenuType) => {
  const {authInfo, isLoggedIn} = authStore();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="cursor-pointer">
            <MoreHorizontal />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Post Menu</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => {
              navigator.clipboard.writeText(`${window.location.origin}/posts/${props.postId}`)

              toast.success("Link successfully copied")
            }}>
              <Copy className="mr-2 h-4 w-4" />
              <span>Copy Link</span>
            </DropdownMenuItem>
            {(authInfo.username === props.username && isLoggedIn) && (
              <>
                <DropdownMenuItem asChild>
                    <Link href={`/posts/${props.postId}/update`}>
                      <span><Pencil className="mr-2 h-4 w-4" /></span>
                      Update Post
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={props.setDeleteCommentHandler} >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete Post</span>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
export default PostItemMenu; 
