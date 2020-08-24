import { u } from '../modules/utils'
import axios from 'axios'

enum Commands { get_status, send_to_buffer }
enum Status { general_status }

let port = 8000
let baseURL = `http://localhost:${port}/`

chrome.runtime.getPlatformInfo((v) => {
    console.log(`Processor architecture: ${v.arch}`)
    console.log(`Native client architecture: ${v.nacl_arch}`)
    console.log(`OS: ${v.os}`)
})

const sendMessage = (message: { [v: string]: any }) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id!, message)
    })
}

chrome.runtime.onMessage.addListener((message: { command: Commands }) => {
    switch(message.command) {
        case Commands.get_status: {
             axios
                .get(baseURL)
                .then(response => {
                    sendMessage({ type: Status.general_status, port, serverOnline: true })
                })
                .catch(error => {
                    sendMessage({ type: Status.general_status, port, serverOnline: false })
                }) 
        }
    }
    
})