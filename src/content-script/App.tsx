import React, { useState, useEffect } from 'react'
import Search from './components/Search'
import Sidebar from './components/Sidebar'
import { Commands, Status } from '../data/constants'
import * as $__ from '../modules/functions'
import './css/main.scss'

const App = () => {
    const [state, setState] = useState('')
    const [serverStatus, setServerStatus] = useState(false)
    const queryState = (stateName: string) => {
        setState(stateName)
    }

    const queryServerState = () => {
        $__.sendMessage({ command: Commands.get_server_status})
    }

    useEffect(() => {
        queryServerState()
        chrome.runtime.onMessage.addListener((message: {serverOnline: boolean}, sender) => {
            console.log(`Is server online? ${message.serverOnline}`)
            setServerStatus(message.serverOnline)
        })
    }, [])

    return (
        <>
            <Search queryState={queryState} />
            <div className="leads-sidebar">
                <Sidebar stateName={state}>
                    <div className="server-info">
                        <p className="info">Server listening? <strong className={`v ${serverStatus ? 'success' : 'failure'}`}>[{ serverStatus ? 'Yes' : 'No' }]</strong></p>
                    </div>
                </Sidebar>
            </div>
        </>
    )
}

export default App