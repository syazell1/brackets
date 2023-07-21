import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import toast from "react-hot-toast";
import { useDeletePost } from "../hooks/useDeletePost";
import { useContext } from "react";
import { authProviderContext } from "@/providers/AuthProvider";
import Link from "next/link";

const PostDropDownMenu = ({id, ownerName} : {id: string, ownerName: string}) => {
    const {data} = useContext(authProviderContext)
    const {mutate, isLoading} = useDeletePost();

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
                {(data.username && data.username === ownerName) && (
                    <>
                        <DropdownMenuItem className="cursor-pointer">
                            <Link href={`/posts/${id}/update`}>Update Post</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onClick={() => {mutate(id)}} >Delete Post</DropdownMenuItem>
                    </>
                )} 
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default PostDropDownMenu;