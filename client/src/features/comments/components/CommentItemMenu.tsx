import {
    MoreVertical,
    MoreHorizontal,
    User,
    Trash2
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
type CommentItemMenuType = {
  setUpdateCommentHandler: () => void,
  setDeleteCommentHandler: () => void
}

  const CommentItemMenu =  (props : CommentItemMenuType) => {
    return (
      <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer">
            <MoreHorizontal />
        </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Comment Menu</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={props.setUpdateCommentHandler}>
              <User className="mr-2 h-4 w-4" />
              <span>Update</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={props.setDeleteCommentHandler}>
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
 export default CommentItemMenu; 