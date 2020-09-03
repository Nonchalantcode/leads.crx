import React, { useState, useEffect } from 'react'
import Search from './components/Search'
import Sidebar from './components/Sidebar'
import { conf, Commands, Message as IncomingMessage } from '../data/constants'
import * as $__ from '../modules/functions'
import './css/main.scss'

const App = () => {

    const [state, setState] = useState('')
    const [isServerOnline, setServerStatus] = useState(false)
    const [leadCount, setLeadCount] = useState(0)
    const [isListeningToBackgroundScript, setListenerStatus] = useState(false)

    const queryState = (stateName: string) => {
        setState(stateName)
    }

    const queryServerStatus = () => {
        $__.sendMessage({ command: Commands.get_server_status})
    }
    
    useEffect(() => {
        if(!isListeningToBackgroundScript) {
            chrome.runtime.onMessage.addListener((message: IncomingMessage, sender) => {
                if('online' in message) {
                    setServerStatus(message.online)
                    return
                }
                if('total' in message) {
                    setLeadCount(message.total)
                }
            })

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
            $__.getFlaggedTLDsNodes()
                .forEach(flaggedNode => {
                    flaggedNode.classList.add('flagged')
                })
        }
        queryServerStatus()
    }, [])

    return (
        <>
            <Search queryState={queryState} />
            <div className="leads-sidebar">
                <Sidebar stateName={state}>
                    <div className="server-info">
                        <p className="info">Server listening? <strong className={`v ${isServerOnline ? 'success' : 'failure'}`}>[{ isServerOnline ? 'Yes' : 'No' }]</strong></p>
                        <p className="info">Lead count: <strong className={`v ${isServerOnline ? 'success' : 'failure'}`}>[{ isServerOnline ? leadCount : 'n/a' }]</strong></p>
                    </div>
                    <div className="legend-info">
                        <p className="info">Legend</p>
                        <span className="legend flagged">Flagged tld</span>
                        <span className="legend black-listed">Blacklisted URL</span>
                    </div>
                </Sidebar>
            </div>
        </>
    )
}

export default App