import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import Search from './components/Search'
import Sidebar from './components/Sidebar'
import './css/main.scss'

const App = () => {
    const [state, setState] = useState('')

    const queryState = (stateName: string) => {
        setState(stateName)
    }

    return (
        <>
            <Search queryState={queryState} />
            <div className="leads-sidebar">
                <Sidebar stateName={state} />
            </div>
        </>
    )
}

export default App