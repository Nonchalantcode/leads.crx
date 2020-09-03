let conf = {
    port: 8000,
    google_url_selector: 'cite',
    next_page_selector: '#foot a#pnnext',
    previous_page_selector: '#foot a#pnprev',
    ignored_tlds: ['.org', 
                    '.gov', 
                    '.info', 
                    '.edu', 
                    '.it', 
                    '.xyz', 
                    '.biz', 
                    '.tv',
                    '.io',
                    '.website',
                    '.online'],
    leads_ext_container: '_leads_ext_container_',
    highlight_ignored_tlds: true,
    suggestionMatchOffset: 2,
    baseURL: 'http://localhost'    
}

enum Commands { 
                get_server_status, 
                get_lead_count,
                send_to_buffer 
              }

type ServerStatus = {
    online: boolean
}

type LeadcountStatus = {
    total: number
}

type Message = ServerStatus | LeadcountStatus

export { conf, Commands, Message }