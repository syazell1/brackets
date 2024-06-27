'use client'

import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

const SearchPostBar = () => {
    const searchParam = useSearchParams();
    const router = useRouter();
    const [searchKeyword, setSearchKeyword] = useState(searchParam.get('q') ?? "")

    const searchHandler = useCallback((k : string, v : string) => {
        const url = new URLSearchParams(searchParam);

        url.set(k, v);

        return url.toString();
    }, [searchParam])

    const submitSearchHandler = () => {
        router.push(`/search?${searchHandler('q', searchKeyword)}`)        
    }

    return <Input 
        placeholder="Search" 
        value={searchKeyword} 
        onChange={(e) => setSearchKeyword(e.target.value)} 
        onKeyDown={(e) => {
            if(e.key === "Enter") {
                submitSearchHandler();
            }
        }} 
        />
}

export default SearchPostBar;