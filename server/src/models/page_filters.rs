#[derive(serde::Deserialize)]
pub struct PageFilters {
    pub search: Option<String>,
    pub page: Option<u32>,
    pub page_size: Option<u32>,
}

#[derive(serde::Deserialize)]
pub struct PostPageFilters {
    pub search: Option<String>,
    pub page: Option<u32>,
    pub page_size: Option<u32>,
}


#[derive(serde::Deserialize)]
pub struct UsersPostFilters{
    pub page: Option<u32>,
    pub page_size: Option<u32>,
}