import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

type CommentDropDownMenuType = {
    id?: string
}

const CommentDropDownMenu = ({id} : CommentDropDownMenuType) => {

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
                <DropdownMenuItem className="cursor-pointer">Copy Comment Link</DropdownMenuItem>
                {/* <DropdownMenuItem className="cursor-pointer">Update Post</DropdownMenuItem> */}
                {/* <DropdownMenuItem className="cursor-pointer" onClick={deletePostHandler} >Delete Post</DropdownMenuItem> */}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default CommentDropDownMenu;