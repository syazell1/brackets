'use client'

import { useSearchParams } from "next/navigation";
import { useState } from "react";

const SearchPostHeader = () => {
    const searchParam = useSearchParams();
    const [searchKeyword] = useState(searchParam.get("q") ?? "");
    return (
        <>
            <h2 className="font-bold text-2xl">Search Results for &lsquo;{searchKeyword}&lsquo;</h2>
        </>
    )
}

export default SearchPostHeader;