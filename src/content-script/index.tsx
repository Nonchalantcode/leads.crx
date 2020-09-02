import { conf } from '../data/constants'
import App from './App'
import React from 'react'
import ReactDOM from 'react-dom'

(function(){
    const appContainer = document.createElement('div')
    appContainer.setAttribute('id', conf.leads_ext_container)
    document.body.appendChild(appContainer)
})()

ReactDOM.render(
    <App />,
    document.getElementById(conf.leads_ext_container)
)

