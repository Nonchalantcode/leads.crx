import { dom, u } from '../modules/utils'
import axios from 'axios'

type CommandlineMessage = {
    command: string,
    arguments?: string[]
}

type BufferCommand = {
    command: 'buffer',
    category: string,
    state: string,
    city: string,
    payload: any
}

console.log("%cBackground script running: [ok]", "font-size: 16px; font-weight: bold; font-family: courier;");
let port = 3000
let baseURL = `http://localhost:${port}/`

function request<T>(method: string, url: string, payload?: any){
    return new Promise((resolve, reject) => {
        let r = new XMLHttpRequest();
        r.open(method, url);
        r.onreadystatechange = ev => {
            if(r.readyState == XMLHttpRequest.DONE && r.status == 200){
                resolve(r.response)
            }
        }
        r.send(payload);
    }) 
}

chrome.runtime.getPlatformInfo((v) => {
    console.log(`Processor architecture: ${v.arch}`)
    console.log(`Native client architecture: ${v.nacl_arch}`)
    console.log(`OS: ${v.os}`)
})