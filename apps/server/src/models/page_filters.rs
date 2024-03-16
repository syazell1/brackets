#[derive(serde::Deserialize)]
pub struct PageFilters {
    pub page: Option<u32>,
    pub page_size: Option<u32>,
}
