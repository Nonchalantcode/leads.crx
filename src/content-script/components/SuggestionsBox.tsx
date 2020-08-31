import React, { useState, useEffect } from 'react'
import ListItem from './ListItem'
import { conf } from '../data/constants'

type SuggestionsBoxProps = {
    searchTerm: string;
    dataSource: string[];
    matchIndex?: number;
    matchOffset?: number;
    className?: string;
}

type SuggestionProps = {
    idx: number;
    text: string;
}

const NumberedSuggestion = (props: SuggestionProps) => {
    return <span><strong className="suggestion-index">{props.idx}.</strong>{props.text}</span>
}


const SuggestionBox = (props: SuggestionsBoxProps) => {
    let matchOffset = props.matchOffset || conf.suggestionMatchOffset
    let matchIndex = props.matchIndex !== undefined ? props.matchIndex : -1

    if(props.searchTerm.length === 0 || props.searchTerm.length < matchOffset) return null
    return <ul className={`suggestions-box ${props.className ? props.className : ''}`}>
                <p className="text-white text-bold primary-font">States suggestions:</p>
                {
                    props
                    .dataSource
                    .filter(item => item.toLowerCase().includes(props.searchTerm.trim().toLowerCase()))
                    .map((suggestion, idx) => {
                        return <ListItem key={suggestion} className={`suggestion ${ idx === matchIndex ? 'selected' : ''}`}>
                                    <NumberedSuggestion text={suggestion} idx={idx + 1} />
                                </ListItem>
                    })
                }
            </ul>
}

export default SuggestionBox