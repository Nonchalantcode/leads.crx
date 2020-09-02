import { u } from '../modules/utils'
import axios from 'axios'
import { conf, Commands, Status } from '../data/constants'

let port = conf.port
let baseURL = `${conf.baseURL}:${port}`

const sendMessage = (message: { [v: string]: any }) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id!, message)
    })
}

chrome.runtime.onMessage.addListener((message: { command: Commands, [prop: string]: any }) => {
    switch(message.command) {
        case Commands.get_server_status: {
             axios
                .get(baseURL)
                .then(response => {
                    sendMessage({ type: Status.general_status, port, serverOnline: true })
                })
                .catch(error => {
                    sendMessage({ type: Status.general_status, port, serverOnline: false })
                })
                break; 
        }
        case Commands.send_to_buffer: {
            const category = message.category
            const state = message.state
            const city = message.city
            const data: string[] = message.data
            
            axios
                .post(`${baseURL}/api/buffer?category=${category}&state=${state}&city=${city}`, data)
                .then(response => {
                    console.log(response.data)
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }
    
})