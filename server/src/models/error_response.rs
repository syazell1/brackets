#[derive(serde::Serialize)]
pub struct ErrorResponse {
    pub error_type : String,
    pub status_code : u16,
    pub details : String    
}