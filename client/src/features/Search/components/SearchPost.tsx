'use client'

import Container from "@/components/layout/Container";
import NavBar from "@/components/ui/nav-bar";
import { Separator } from "@/components/ui/separator";
import PostsList from "@/features/Posts/components/PostsList";
import { useSearchParams } from "next/navigation";

const SearchPost = () => {
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get("s")
        return (
            <>
                <NavBar />
                <Container className="pt-[75px]">
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center gap-4">
                            <h2 className="text-lg font-semibold">Search Resutls for "{searchQuery}"</h2>
                        </div>
                        <Separator className="my-4" />
                        <PostsList searchParam={searchQuery!} />
                    </div>
                </Container>
            </>
        );
}

export default SearchPost;