import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import toast from "react-hot-toast";

const PostDropDownMenu = ({id} : {id?: string}) => {
    const copyLinkHandler = () => {
        const url = window.location.href
        navigator.clipboard.writeText(`${url}posts/${id}`);
        toast.success("Post Link was copied on the clipboard.")
    }


    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <div>
                    <MoreVertical size={25} />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Post Menu</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={copyLinkHandler}>Copy Post Link</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">Update Post</DropdownMenuItem>
                {/* <DropdownMenuItem className="cursor-pointer" onClick={deletePostHandler} >Delete Post</DropdownMenuItem> */}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default PostDropDownMenu;