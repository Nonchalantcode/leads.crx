import React, { useState } from 'react'
import UserInput from "./UserInput";
import { statesToCitiesMappings, allStates } from '../data/data'
import SuggestionBox from './SuggestionsBox';
import { capitalize, noop, isEmpty } from '../functions/functions'
import { conf } from '../data/constants';

const Search = (props: { queryState: (v: string) => void }) => {
    const [category, setCategory] = useState('')
    const [state, setState] = useState('')
    const [city, setCity] = useState('')
    const [categorySuggestions, updateCategorySuggestions] = useState(new Array<{suggestion: string, selected: boolean}>())
    const [stateSuggestions, updateStateSuggestions] = useState(new Array<{suggestion: string, selected: boolean}>())
    const [citySuggestions, updateCitySuggestions] = useState(new Array<{suggestion: string, selected: boolean}>())
    const [suggestionIndex, updateSuggestionIndex] = useState(-1) /* start without selecting a particular suggestion */

    const updateInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const value = ev.target.value
        switch(ev.target.name) {
            case 'category': {
                setCategory(value)
                break
            }
            case 'state': {
                value.trim().length < conf.suggestionMatchOffset 
                    ? clearSuggestions('state')
                    : updateStateSuggestions(
                        allStates
                            .filter(state => state.toLowerCase().includes(value.trim().toLowerCase()))
                            .map((state, i) => ({suggestion: state, selected: i === suggestionIndex}))
                      )
                setState(value)
                break
            }
            case 'city': {
                if(!isEmpty(value.trim()) &&  statesToCitiesMappings[state.trim()]) { /* If something is being typed into the City input and the State is set */
                    updateCitySuggestions(
                       statesToCitiesMappings[state.trim()]
                           .filter(city => city.toLowerCase().includes(value.trim().toLowerCase()))
                           .map((city, i) => ({suggestion: city, selected: i === suggestionIndex}))
                    )
                } else {
                    clearSuggestions('city')
                }
                setCity(value)
                break
            }
        }
    }

    const clearSuggestions = (suggestionsCollName: string) => {
        switch(suggestionsCollName) {
            case 'state': {
                updateStateSuggestions([])
                break
            }
            case 'city': {
                updateCitySuggestions([])
                break
            }
            case 'category': {
                updateCategorySuggestions([])
                break
            }
        }
        updateSuggestionIndex(-1)
    }

    const updatePick = (suggestionsCollName: string, index: number) => {
        switch(suggestionsCollName) {
            case 'state': {
                updateStateSuggestions(
                    stateSuggestions.map((s, i) => index === i ? {...s, selected: true} : {...s, selected: false})
                )
                break
            }
            case 'city': {
                updateCitySuggestions(
                    citySuggestions.map((c, i) => index === i ? {...c, selected: true} : {...c, selected: false})
                )
                break
            }
        }

    }

    const pick = (ev: React.KeyboardEvent) => {
        const inputName = (ev.target as HTMLInputElement).name
        const suggestionsColl = inputName === 'state' ? stateSuggestions : inputName === 'city' ? citySuggestions  : categorySuggestions
        if( ev.key === 'ArrowDown' &&  !isEmpty(suggestionsColl) ) {
            const nextIndex = suggestionIndex === suggestionsColl.length - 1 ? 0 : suggestionIndex + 1
            updatePick(inputName, nextIndex)
            updateSuggestionIndex(nextIndex)
            return
        }
        if( ev.key === 'ArrowUp' && !isEmpty(suggestionsColl) ) {
            const nextIndex = suggestionIndex - 1 < 0 ? suggestionsColl.length - 1 : suggestionIndex - 1
            updatePick(inputName, nextIndex)
            updateSuggestionIndex(nextIndex)
            return
        }
        if( (ev.key === 'Enter' || ev.key === 'Tab') && 
            !isEmpty(suggestionsColl) && 
            suggestionIndex !== -1) { /* if a suggestion is currently highlighted and user presses Enter or Tab, use it */
                switch(inputName) {
                    case 'state': {
                        let state = suggestionsColl[suggestionIndex].suggestion
                        setState(state)
                        props.queryState(state.trim())
                        break
                    }
                    case 'city': {
                        setCity(suggestionsColl[suggestionIndex].suggestion)
                        break
                    }
                }
                clearSuggestions(inputName)
        }
        if( ev.key === 'Escape' && !isEmpty(suggestionsColl)) {
            clearSuggestions(inputName)
        }
    }

    return (
        <div className="crx-leads">
            <div id="search-bar">
                <div className="category-container">
                    <UserInput placeholder="Business category" 
                                name="category" 
                                value={category} 
                                changeHandler={updateInput} />
                </div>
                <div className="state-container">
                    <SuggestionBox searchTerm={state} data={stateSuggestions} />
                    <UserInput placeholder="State" 
                                name="state" 
                                value={state} 
                                changeHandler={updateInput} 
                                keydownHandler={pick}
                                blurHandler={ () => clearSuggestions('state') } />
                </div>
                <div className="city-container">
                    <SuggestionBox searchTerm={city} data={citySuggestions} />
                    <UserInput placeholder="City" 
                                name="city" 
                                value={city} 
                                changeHandler={updateInput} 
                                keydownHandler={pick}
                                blurHandler={ () => clearSuggestions('city') } />
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