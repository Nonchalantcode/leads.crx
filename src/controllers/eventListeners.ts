import { conf } from '../data/constants'

export const registerKeyBindings = () => {
    window.addEventListener('keydown', (ev) => {
        if(ev.altKey && ev.key === 'n') {
            try {
                (document.querySelector(conf.next_page_selector) as HTMLAnchorElement)
                    .click()
            } catch(err) {
                console.warn(`Couldn't go to next page. Has selector for next page changed or already in last page?`)
            }
        }
        if(ev.altKey && ev.key === 'p') {
            try {
                (document.querySelector(conf.previous_page_selector) as HTMLAnchorElement)
                    .click()
            } catch(err) {
                console.warn(`Couldn't go to previous page. Has selector for previous page changed or already on first page?`)
            }
        }
    })
}