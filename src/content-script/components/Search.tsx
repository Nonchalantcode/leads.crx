import React, { useState } from 'react'
import StatelessInput from "./StatelessInput";
import { statesToCitiesMappings, allStates } from '../data/data'
import SuggestionBox from './SuggestionsBox';
import { capitalize } from '../functions/functions'
const Search = () => {

    const [category, setCategory] = useState('')
    const [state, setState] = useState('')
    const [city, setCity] = useState('')

    const [suggestionIndex, setSuggestionIndex] = useState(-1)

    const updateInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const value = ev.target.value.trim()
        switch(ev.target.name) {
            case 'category': {
                setCategory(value)
                break
            }
            case 'state': {
                setState(value)
                break
            }
            case 'city': {
                setCity(value)
            }
        }
    }

    const pick = (ev: React.KeyboardEvent) => {
        if(ev.key === 'ArrowDown') {
            setSuggestionIndex(suggestionIndex + 1)
        }
    }

    return (
        <div className="crx-leads">
            <div id="search-bar">
                <div className="category-container">
                    <StatelessInput placeholder="Business category" name="category" value={category} changeHandler={updateInput} />
                </div>
                <div className="state-container">
                    <SuggestionBox searchTerm={state} dataSource={allStates} matchOffset={2} matchIndex={suggestionIndex} />
                    <StatelessInput placeholder="State" name="state" value={state} changeHandler={updateInput} keydownHandler={pick} />
                </div>
                <div className="city-container">
                    <StatelessInput placeholder="City" name="city" value={city} changeHandler={updateInput} />
                </div>
                <div className="submit-container">
                    <button className="submit">Commit</button>
                </div>
            </div>
            <div className="sidebar"></div>
        </div>
    )
}

export default Search