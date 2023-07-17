interface PageMetadata {
    currentPage: number
    pageSize: number,
    totalItemsCount: number,
    totalPageCount: number,
    hasNextPage: boolean,
    hasPreviousPage: boolean 
}

export interface PagedList<T> {
    results: T[],
    pageData: PageMetadata
}