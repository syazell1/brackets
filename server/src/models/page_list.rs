#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PageMetadata {
    pub current_page: u32,
    pub page_size: u32,
    total_page_count: u32,
    total_items_count: u32,
    has_prev_page: bool,
    has_next_page: bool,
}

#[derive(serde::Serialize)]
pub struct PageList<T> {
    pub data: T,
    pub page_metadata: PageMetadata,
}

impl<T> PageList<T> {
    pub fn new(data: T, current_page: u32, page_size: u32, total_items_count: u32) -> Self {
        let total_page_count = total_items_count.div_ceil(page_size);

        let pm = PageMetadata {
            current_page,
            page_size,
            total_items_count,
            total_page_count,
            has_prev_page: current_page > 1,
            has_next_page: total_page_count > current_page,
        };

        Self {
            data,
            page_metadata: pm,
        }
    }
}
