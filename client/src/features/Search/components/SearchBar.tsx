'use client'

import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { createRef, useRef, useState } from "react";

const SearchBar = () => {
    const searchInput = createRef<HTMLInputElement>() 
    const router = useRouter();

    return (
        <>
            <Input onKeyDown={(e) => {
                if(e.key == "Enter")
                {
                    router.push(`/posts/search?s=${searchInput.current?.value}`)
                    router.refresh();
                }
                return
            }} 
            placeholder="Search for posts"
            ref={searchInput} />
        </>
    )
}

export default SearchBar;