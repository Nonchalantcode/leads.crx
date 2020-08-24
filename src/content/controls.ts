import { dom, u } from "../modules/utils"
import { allStates, statesToCitiesMappings } from "./data"

enum Keys { Up = "ArrowUp", Down = "ArrowDown", Enter = "Enter", Tab = "Tab" }



let citiesSuggestionsElement = 
    dom.create(
        `<div id="main-panel">
            <div id="ext-suggestions">
                <h3>City suggestions</h3>
                <div class="city-suggestions-panel"></div>
            </div>
            <div class="status-area"></div>
         </div>`) as HTMLElement

let userInputElement =
    dom.create(
        `<div class="ext-container controls">
            <div class="inputs">
                <input type="text" placeholder="Category" id="category" />
                <input type="text" placeholder="State" id="state" />
                <input type="text" placeholder="City" id="city" />
            </div>
            <div class="state-suggestions"></div>
            <div class="city-suggestions"></div>
            <div class="commit"><button>Commit</button></div>
        </div>`) as HTMLInputElement

let statusArea = dom.f('.status-area', citiesSuggestionsElement)! as HTMLDivElement
let stateInput = dom.f('input#state', userInputElement)!
let cityInput = dom.f('input#city', userInputElement)!
let statesSuggestionBox = dom.f('.state-suggestions', userInputElement)! as HTMLDivElement
let citiesSuggestionBox = dom.f('.city-suggestions', userInputElement)! as HTMLDivElement
let commitButton = dom.f('.commit button', userInputElement)! as HTMLButtonElement
let citySuggestionsPanel = dom.f(`#ext-suggestions .city-suggestions-panel`, citiesSuggestionsElement)! as HTMLDivElement

stateInput.addEventListener('input', ev => {
    let target = ev.target as HTMLInputElement,
        text = target.value.trim()
    if(text.length >= 2){
        let suggestions = allStates.filter(state => {
                            state = state.toLowerCase()
                            text = text.toLowerCase()
                            return state === text || state.includes(text)
                        })
        
        statesSuggestionBox.hasChildNodes() ? 
            [...statesSuggestionBox.childNodes].forEach(c => c.parentElement?.removeChild(c)) : 
            null
        suggestions.forEach(suggestion => dom.append(dom.create(`<span class="suggestion">${suggestion}</span>`) as HTMLElement, statesSuggestionBox))
    } else {
        [...statesSuggestionBox.childNodes].forEach(c => c.parentElement?.removeChild(c))
    }
})

stateInput.addEventListener('blur', ev => {
    [...statesSuggestionBox.childNodes].forEach(c => c.parentElement?.removeChild(c))
    if(!((ev.target as HTMLInputElement).value in statesToCitiesMappings)){
        [...citySuggestionsPanel.childNodes].forEach(c => c.parentElement?.removeChild(c))
    }
})

function pickSuggestion(ev: KeyboardEvent, suggestionsContainer: HTMLElement): void {
    let anySelected = [...suggestionsContainer.childNodes as NodeListOf<HTMLSpanElement>].some(suggestion => suggestion.classList.contains('selected'))
    
    switch(ev.key) {
        case Keys.Down: {
            if(anySelected){
                let selectedNode = dom.f('.selected', suggestionsContainer)!
                selectedNode.classList.remove('selected')
                selectedNode.nextElementSibling === null ? 
                    (suggestionsContainer.firstChild as HTMLSpanElement).classList.add('selected') :
                    selectedNode.nextElementSibling.classList.add('selected')
            } else {
                (suggestionsContainer.firstChild as HTMLSpanElement).classList.add('selected')
            }
            break;
        }
        case Keys.Up: {
            if(anySelected){
                let selectedNode = dom.f('.selected', suggestionsContainer)!
                selectedNode.classList.remove('selected')
                selectedNode.previousElementSibling === null ? 
                    (suggestionsContainer.lastChild as HTMLSpanElement).classList.add('selected') :
                    selectedNode.previousElementSibling.classList.add('selected')
            } else {
                (suggestionsContainer.lastChild as HTMLSpanElement).classList.add('selected')
            }
            break;
        }
    }
}

function clearCitySuggestions(suggestionsContainer: HTMLElement): void {
    [...citySuggestionsPanel.childNodes].forEach(c => c.parentElement?.removeChild(c))
}

function displayCitySuggestions(stateName: string, suggestionsContainer: HTMLElement): void {
    if(stateName in statesToCitiesMappings){
        statesToCitiesMappings[stateName].forEach(city => {
            dom.append(
                dom.create(`<span class="suggestion city-suggestion">${city}</span>`) as HTMLSpanElement,
                suggestionsContainer
            )
        })
    }
}

stateInput.addEventListener('keydown', ev => {
    pickSuggestion(ev, statesSuggestionBox)
    switch(ev.key) {
        case Keys.Enter: {
            stateInput.value = dom.f('.selected', statesSuggestionBox)!.textContent!
            cityInput.focus()
            clearCitySuggestions(citySuggestionsPanel)
            displayCitySuggestions(stateInput.value, citySuggestionsPanel)
            break;
        }
        case Keys.Tab: {
            stateInput.value = dom.f('.selected', statesSuggestionBox)!.textContent!
            clearCitySuggestions(citySuggestionsPanel)
            displayCitySuggestions(stateInput.value, citySuggestionsPanel)
            break;
        }
    }
})

cityInput.addEventListener('blur', ev => {
    [...citiesSuggestionBox.childNodes].forEach(c => c.parentElement?.removeChild(c))
})

cityInput.addEventListener('input', ev => {
    let target = ev.target as HTMLInputElement,
        text = target.value.trim(),
        stateValue = stateInput.value
    if((stateValue in statesToCitiesMappings) && text.length >= 2){
        let suggestions = statesToCitiesMappings[stateValue].filter(city => {
                            city = city.toLowerCase()
                            text = text.toLowerCase()
                            return city === text || city.includes(text)
                        })
        
        citiesSuggestionBox.hasChildNodes() ? 
            [...citiesSuggestionBox.childNodes].forEach(c => c.parentElement?.removeChild(c)) : 
            null
        suggestions.forEach(suggestion => dom.append(dom.create(`<span class="suggestion">${suggestion}</span>`) as HTMLElement, citiesSuggestionBox))
        return
    }
    [...citiesSuggestionBox.childNodes].forEach(c => c.parentElement?.removeChild(c))

})

cityInput.addEventListener('keydown', ev => {
    pickSuggestion(ev, citiesSuggestionBox)
    switch(ev.key) {
        case Keys.Enter: {
            cityInput.value = dom.f('.selected', citiesSuggestionBox)!.textContent!
            commitButton.focus()
            break
        }
        case Keys.Tab: {
            cityInput.value = dom.f('.selected', citiesSuggestionBox)!.textContent!
            break
        }
    }
})

export function insertControls(){
    [citiesSuggestionsElement, userInputElement].forEach(e => dom.append(e, document.body))
}

export { userInputElement as UserInputSection, allStates as StatesSuggestions, statusArea }