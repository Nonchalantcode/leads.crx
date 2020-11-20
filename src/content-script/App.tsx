import React, { useState, useEffect } from 'react'
import Search from './components/Search'
import Sidebar from './components/Sidebar'
import { statesToCitiesMappings } from '../data/data'
import * as $__ from '../modules/functions'
import { registerKeyBindings } from '../controllers/eventListeners'
import  * as middleware  from '../controllers/middleware'
import './css/main.scss'
import { vetolist } from '../data/data'

const App = () => {

    const domainMatcher = /(https?:\/\/)?(www\.)?(.+)\.\w+($|\/)/
    const [state, setState] = useState('')
    const [isServerOnline, setServerStatus] = useState(false)
    const [leadCount, setLeadCount] = useState(0)
    const [keyboardBindinsSet, updateBindingStatus] = useState(false)
    const [leadsList, updateLeadsList] = useState(new Array<string>())
    const [isDiscarding, setDiscard] = useState(false)

    const queryState = (stateName: string) => {
        setState(stateName)
    }

    const getUserInputs = async (category: string, state: string, city: string) => {
        if($__.isEmpty(category)) {
            alert(`Category value can't be empty`)
            return false
        }
        if($__.isEmpty(state)) {
            alert(`State value can't be empty`)
            return false
        }
        if($__.isEmpty(city)) {
            alert(`City value can't be empty`)
            return false 
        }
        if(statesToCitiesMappings[state] === undefined) {
            alert(`${state} is not in the list of suggested states. Is it mispelled perhaps?`)
            return false
        }
        if(!statesToCitiesMappings[state].includes(city)) {
            alert(`${city} is not in the list of cities for ${state}`)
            return false
        }

        const urls = leadsList.filter(lead => {
            try {
                const [, , , domain ] = lead.match(domainMatcher)!
                return !vetolist.has(domain)
            } catch (error) {
                return true
            }
        })

        try {
            let {data: {leadcount}} = await middleware.bufferLeads($__.capitalize(category), $__.capitalize(state), $__.capitalize(city), urls)
            setLeadCount(leadcount)
            return true
        } catch {
            alert(`Couldn't send leads to server`)
            return false
        }

    }

    useEffect(() => {

        if(!keyboardBindinsSet) {
            registerKeyBindings()
            updateBindingStatus(true)
        }
        (async () => {
            try {
                let {data} = await middleware.queryServerStatus()
                setServerStatus(true)
                setLeadCount(data.leadcount)
            } catch (err) {
                console.log(`Server doesn't seem to be online or extension is listening to wrong port.`)
            }
        })()

        $__.getFlaggedTLDsNodes()
            .forEach(flaggedNode => flaggedNode.classList.add('flagged'))
        updateLeadsList($__.getSearchResults())

    }, [])

    const saveLeads = async () => {
        let {data: {message, error}} = await middleware.saveBuffer()
        if(error) {
            alert(`An error has ocurred while trying to save leads: ${message}`)
        } else {
            setLeadCount(0)
            alert("Leads were saved!")
        }
    }

    const discardLeads = async () => {
        let {data: {message, error}} = await middleware.discardBuffer()
        if(error) {
            alert(message)
        } else {
            setLeadCount(0)
            alert(message)
        }
    }

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
                    {
                        leadCount !== 0 ? 
                            <div style={{marginTop: '10px'}}>
                                <div className={`save ${isDiscarding ? 'hidden' : ''}`}>
                                    <button className="submit" onClick={async () => await saveLeads()}>
                                        Save leads
                                    </button>
                                </div>
                                <div className="discard" style={{marginTop: '10px'}}>
                                    <button className={`discard ${isDiscarding ? 'hidden': ''}`} onClick={() => setDiscard(true)}>
                                        Discard leads
                                    </button>
                                    <button className={`confirm ${isDiscarding ? '' : 'hidden'}`} onClick={async () =>  await discardLeads()}>Yes</button>
                                    <button className={`cancel ${isDiscarding ? '' : 'hidden'}`} onClick={() => setDiscard(false)}>No</button>
                                </div>
                            </div> :
                            null
                    }
                </Sidebar>
            </div>
        </>
    )
}

export default App