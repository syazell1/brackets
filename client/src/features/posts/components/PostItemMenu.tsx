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
import { useContext, useState } from "react";
import { authContextProvider } from "@/providers/AuthContext";
import toast from "react-hot-toast";

type PostItemMenuType = {
  postId : string,
  username : string,
  setUpdateCommentHandler: () => void,
  setDeleteCommentHandler: () => void
}
const PostItemMenu = (props : PostItemMenuType) => {
  const { usersInfo, isLoggedIn } = useContext(authContextProvider);

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
            {(usersInfo.username === props.username && isLoggedIn) && (
              <>
                <DropdownMenuItem onClick={props.setUpdateCommentHandler}>
                  <Pencil className="mr-2 h-4 w-4" />
                  <span>Update Post</span>
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
