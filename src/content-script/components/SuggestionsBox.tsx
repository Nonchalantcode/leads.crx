import React, { useState, useEffect, useCallback } from 'react'
import ListItem from './ListItem'
import { conf } from '../data/constants'

type SuggestionsBoxProps = {
    searchTerm: string;
    data: {suggestion: string, selected: boolean}[];
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
    if(props.data.length === 0) return null
    return <ul className={`suggestions-box ${props.className ? props.className : ''}`}>
                <p className="text-white text-bold primary-font">States suggestions:</p>
                {
                    props
                    .data
                    .map((s, idx) => {
                        return <ListItem key={s.suggestion} className={`suggestion ${s.selected ? 'selected' : ''}`}>
                                    <NumberedSuggestion text={s.suggestion} idx={idx + 1} />
                                </ListItem>
                    })
                }
            </ul>
}

export default SuggestionBox