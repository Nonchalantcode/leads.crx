import React from 'react'
import ReactDOM from 'react-dom'
import './css/main.scss'

const Search = () => {
    return (
        <div className="crx-leads">
            <div id="search-bar">
                <input type="text" name="category" className="crx-input" />
                <input type="text" name="state" className="crx-input" />
                <input type="text" name="city" className="crx-input" />
                <button className="submit">Commit</button>
            </div>
        </div>
    )
}



const App = () => {
    return (
        <Search />
    )
}

export default App