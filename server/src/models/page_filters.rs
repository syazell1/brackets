#[derive(serde::Deserialize)]
pub struct PageFilters {
    pub search : Option<String>,
    pub page: Option<u32>,
    pub page_size: Option<u32>,
    pub is_deleted : Option<bool>
}
