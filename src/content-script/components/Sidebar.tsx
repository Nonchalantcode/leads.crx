import React, { useState, useEffect } from 'react'
import ListItem from './ListItem'
import { statesToCitiesMappings as cities } from "../../data/data"
import { conf } from '../../data/constants'

const Sidebar = (props: { stateName: string, children: React.ReactNode }) => {
    const suggestions = cities[props.stateName]
    
    const displayCities = () => {
        return (
            <>
                <h3 className="heading text-white">City suggestions for { props.stateName }</h3>
                <ul className="cities"> 
                    {
                        suggestions.map((city, index) => 
                                <ListItem key={city}>
                                    <span className="city">
                                        <strong className="city-number">{ index }.</strong>
                                        { city }
                                    </span>
                                </ListItem>
                        )
                    }
                </ul>
            </>
        )
    }

    return (
        <div id="crx-sidebar">
            <div className="cities-suggestion">
                { suggestions !== undefined ? displayCities() : <h3 className="heading text-white">[ No city suggestions ]</h3> }
            </div>
            <div className="extension-info">
                <p className="info">Extension talking to port: <strong className="v success">[{conf.port}]</strong></p>
                <p className="info">Ignoring urls ending in: <strong className="v">[{conf.ignored_tlds.join(', ')}]</strong></p>
            </div>
            {
                props.children
            }
        </div>
    )
}

export default Sidebar