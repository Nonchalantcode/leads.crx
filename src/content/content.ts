import { dom, u } from "../modules/utils";
import { insertControls, UserInputSection, StatesSuggestions, statusArea } from './controls'
import './main.scss'

enum Commands { get_status, send_to_buffer }
enum Status { general_status }

insertControls();

const GOOGLE_URL_SELECTOR = "cite";

// The function below has some values that are specific to the Google Search engine and thus
// prone to breaking if breaking changes are made to that search engine. Update accordingly.

let getURLs = (): Set<string> => {
    return u.thread(
            [...dom.fall(GOOGLE_URL_SELECTOR) as NodeListOf<Element>],  // gather all urls
            [(all: Element[]) => {
               return  all.reduce((acc, current) => {
                    let url = current.textContent?.split(/\s/)[0]!;
                    if(url.endsWith("/")){
                        url = url.slice(0, url.length - 1);
                    }
                    if(url.endsWith(".org")     || 
                       url.endsWith(".gov")     || 
                       url.endsWith(".info")    || 
                       url.endsWith(".edu")     || 
                       url.endsWith(".xyz")     ||
                       url.endsWith(".biz")     ||
                       url.endsWith(".io")){
                        return acc;
                    }
                    acc.push(url);
                    return acc;
                }, new Array<string>())
            }],
            [(all: Element[]) => new Set(all)]
        ) as Set<string>;
}


let sendMessage = <T extends { [v: string]: any }>(message: T) => {
    chrome.runtime.sendMessage(message)
}

function isEmpty(v: [] | string): boolean{
    return v.length === 0;
}

function capitalize(str: string): string{
    return u.thread(
                str,
                [(v: string) => v.toLowerCase()],
                [(v: string) => {
                    return v.trim()
                            .split(/\s/)
                            .map(substr => {
                                let [firstChar] = substr;
                                return `${firstChar.toUpperCase()}${substr.slice(1, substr.length)}`;
                            })
                            .join(" ");
                }]
            )
}

let [category, state, city] = dom.fall("#category, #state, #city") as NodeListOf<HTMLInputElement>;

// Keyboard bindings 

window.addEventListener('keydown', ev => {
    if(ev.key === "f" && ev.altKey && ev.ctrlKey){
        category.focus();    
    }
})

// UI events.

dom.f(".commit button", UserInputSection)?.addEventListener('click', ev => {
    if(isEmpty(category.value) || isEmpty(state.value)){
        window.alert("Category or State is missing");
        return;
    }
    if(StatesSuggestions.indexOf(state.value) === -1) {
        window.alert("Value of state is not in the list of available states in DB.");
        return;
    }
    sendMessage({
        command: Commands.send_to_buffer,
        category: capitalize(category.value),
        state: capitalize(state.value),
        city: isEmpty(city.value) ? '' : capitalize(city.value),
        data: [...getURLs()]
    });
    window.alert("Batch sent to buffer");
});

sendMessage({
    command: Commands.get_status
})

chrome.runtime.onMessage.addListener((message: { type: Status, [props: string]: any }, sender) => {
    switch(message.type) {
        case Status.general_status: {
            statusArea.appendChild(
                dom.create(`<p>Extension talking to port: <strong>[${message.port}]</strong></p>`) as HTMLElement
            )
            statusArea.appendChild(
                dom.create(`<p>Server online? <strong>[${message.serverOnline ? 'Yes' : 'No'}]</strong></p>`) as HTMLElement
            )
        }
    }
})