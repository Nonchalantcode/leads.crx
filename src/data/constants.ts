let conf = {
    port: 8000,
    google_url_selector: 'cite',
    ignored_tlds: ['.org', 
                    '.gov', 
                    '.info', 
                    '.edu', 
                    '.it', 
                    '.xyz', 
                    '.biz', 
                    '.io',
                    '.website',
                    '.online'],
    leads_ext_container: '_leads_ext_container_',
    suggestionMatchOffset: 2,
    baseURL: 'http://localhost'    
}

enum Commands { get_server_status, send_to_buffer }
enum Status { general_status }

export { conf, Commands, Status }