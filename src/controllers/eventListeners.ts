import { conf } from '../data/constants'

export const registerKeyBindings = () => {
    let latency = 500
    let ctrlBindingActive = false
    let shiftBindingActive = false
    const googleSearchInput = document.querySelector<HTMLInputElement>(`${conf.google_search_input_selector}`)

    /* category input created by the react application. This isn't the nicest way to select this component, but it's quick and doesn't require a use of ref */
    const categoryInput = document.querySelector<HTMLInputElement>('.crx-leads #search-bar div.category-container input')

    window.addEventListener('keydown', (ev) => {
        if(ev.altKey && ev.key === 'n') {
            try {
                (document.querySelector(conf.next_page_selector) as HTMLAnchorElement)
                    .click()
            } catch(err) {
                console.warn(`Couldn't go to next page. Has selector for next page changed or already in last page?`)
            }
            return
        }
        if(ev.altKey && ev.key === 'p') {
            try {
                (document.querySelector(conf.previous_page_selector) as HTMLAnchorElement)
                    .click()
            } catch(err) {
                console.warn(`Couldn't go to previous page. Has selector for previous page changed or already on first page?`)
            }
            return
        }
        if(ev.ctrlKey) {
            if(ctrlBindingActive) {
                googleSearchInput!.focus()
                ctrlBindingActive = false
                return
            }
            ctrlBindingActive = true
            setTimeout(() => {
                ctrlBindingActive = false
            }, latency)
            return
        }
        if(ev.shiftKey) {
            if(shiftBindingActive) {
                categoryInput!.focus()
                shiftBindingActive = false
            }
            shiftBindingActive = true
            setTimeout(() => {
                shiftBindingActive = false
            }, latency)
        }
    })
}