import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import toast from "react-hot-toast";

type CommentDropDownMenuType = {
    id?: string
}

const CommentDropDownMenu = ({id} : CommentDropDownMenuType) => {
    
    const copyLinkHandler = () => {
        const url = window.location.origin
        navigator.clipboard.writeText(`${url}/comments/${id}`);
        toast.success("Comment Link was copied on the clipboard.")
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <div>
                    <MoreVertical size={25} />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Comment Menu</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={copyLinkHandler} className="cursor-pointer">Copy Comment Link</DropdownMenuItem>
                {/* <DropdownMenuItem className="cursor-pointer">Update Post</DropdownMenuItem> */}
                {/* <DropdownMenuItem className="cursor-pointer" onClick={deletePostHandler} >Delete Post</DropdownMenuItem> */}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default CommentDropDownMenu;