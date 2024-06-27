'use client'

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

const FeaturedPostMenu = () => {
    return (
        <Select onValueChange={(e) => console.log(e)} defaultValue="today">
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter Post By" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Sort By</SelectLabel>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                    <SelectItem value="all-time">All Time</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

export default FeaturedPostMenu;