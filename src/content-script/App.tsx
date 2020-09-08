import React, { useState, useEffect } from 'react'
import Search from './components/Search'
import Sidebar from './components/Sidebar'
import { statesToCitiesMappings } from '../data/data'
import * as $__ from '../modules/functions'
import { registerKeyBindings } from '../controllers/eventListeners'
import  * as middleware  from '../controllers/middleware'
import './css/main.scss'

const App = () => {

    const [state, setState] = useState('')
    const [isServerOnline, setServerStatus] = useState(false)
    const [leadCount, setLeadCount] = useState(0)
    const [keyboardBindinsSet, updateBindingStatus] = useState(false)
    const [leadsList, updateLeadsList] = useState(new Array<string>())
    const [afterBufferMessage, setAfterBufferMessage] = useState('')

    const queryState = (stateName: string) => {
        setState(stateName)
    }

    const getUserInputs = (category: string, state: string, city: string) => {
        if($__.isEmpty(category)) {
            alert(`Category value can't be empty`)
            return
        }
        if($__.isEmpty(state)) {
            alert(`State value can't be empty`)
            return
        }
        if($__.isEmpty(city)) {
            alert(`City value can't be empty`)
            return
        }
        if(statesToCitiesMappings[state] === undefined) {
            alert(`${state} is not in the list of suggested states. Is it mispelled perhaps?`)
            return
        }
        if(!statesToCitiesMappings[state].includes(city)) {
            alert(`${city} is not in the list of cities for ${state}`)
            return
        }

        (async () => {
            try {
                let { data: message } = await middleware.bufferLeads($__.capitalize(category), $__.capitalize(state), $__.capitalize(city), leadsList)
                let {data: { total }} = await middleware.getLeadsStats()
                setLeadCount(total)
                setAfterBufferMessage(message)
                setTimeout(() => setAfterBufferMessage(''), 1500)
            } catch (err) {
                console.log(`Something has gone wrong`)
            }
        })()

    }
    
    useEffect(() => {
        if(!keyboardBindinsSet) {
            registerKeyBindings()
            updateBindingStatus(true)
        }
        (async () => {
            try {
                let _ = await middleware.queryServerStatus()
                let { data: { total } } = await middleware.getLeadsStats()
                setServerStatus(true)
                setLeadCount(total)
            } catch (err) {
                console.log(`Server doesn't seem to be online or extension is listening to wrong port.`)
            }
        })()

        $__.getFlaggedTLDsNodes()
            .forEach(flaggedNode => flaggedNode.classList.add('flagged'))
        updateLeadsList($__.getSearchResults())
    }, [])

    return (
        <>
            <Search queryState={queryState} submitHandler={getUserInputs} />
            <div className="leads-sidebar">
                <Sidebar stateName={state}>
                    <div className="server-info">
                        <p className="info">
                            Server listening? <strong className={`v ${isServerOnline ? 'success' : 'failure'}`}>[{ isServerOnline ? 'Yes' : 'No' }]</strong>
                        </p>
                        <p className="info">
                            Lead count: <strong className={`v ${isServerOnline ? 'success' : 'failure'}`}>[{ isServerOnline ? leadCount : 'n/a' }]</strong>
                        </p>
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