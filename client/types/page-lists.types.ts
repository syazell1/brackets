interface PageMetadata {
  currentPage: number,
  pageSize: number,
  totalPageCount: number,
  totalItemsCount: number,
  hasPrevPage: boolean,
  hasNextPage: boolean
}

export interface PageList<T> {
  data: T,
  pageMetadata: PageMetadata
}
