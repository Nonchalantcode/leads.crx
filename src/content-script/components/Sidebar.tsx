import React, { useState } from 'react'
import ListItem from './ListItem'
import { statesToCitiesMappings as cities } from "../../data/data"
import Axios from 'axios'
import { conf } from '../../data/constants'

const Sidebar = (props: { stateName: string, children: React.ReactNode, saveLeadsCallback: (status: {saved: boolean, message: string, total: number}) => void }) => {
    const suggestions = cities[props.stateName]
    const [isSaving, setSaveStatus] = useState(false)
    const [filename, setFilename] = useState('')

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


    const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setFilename(ev.target.value)
    }

    const saveLeads = () => {
        let fname = filename.trim()
        if(fname.length === 0) {
            alert('Enter a filename')
            return
        }
        Axios.post<{filename: string}, {data: {saved: boolean, message: string, total: number}}>(`${conf.baseURL}:${conf.port}/api/save`, { filename: fname })
            .then(response => {
                props.saveLeadsCallback(response.data)
                if(response.data.saved) setSaveStatus(false)
            })
            .catch(err => {
                alert('There was an error while trying to save leads to disk.')
            })
    }

    return (
        <div id="crx-sidebar">
            <div className="cities-suggestion">
                { suggestions !== undefined ? displayCities() : <h3 className="heading text-white">[ No city suggestions ]</h3> }
            </div>
            {
                props.children
            }
            <div className="save">
                {
                    isSaving ? 
                        <div className="save-panel">
                            <input type="text" 
                                    placeholder="File name"
                                    value={filename}
                                    onChange={handleChange} />
                            <button className="ok-btn" onClick={saveLeads}>OK</button>
                            <button className="cancel-btn" onClick={() => setSaveStatus(false)}>X</button>
                        </div> :
                        <button className="save-btn" onClick={() => {
                            setSaveStatus(true)
                            setFilename('') 
                        }}>Save</button>
                }
            </div>
        </div>
    )
}

export default Sidebar