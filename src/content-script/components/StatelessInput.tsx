import React, { ReactEventHandler } from 'react';

type InputProps = {
    placeholder: string;
    name: string;
    value: string;
    changeHandler: ReactEventHandler;
    className?: string;
    keydownHandler?: ReactEventHandler;
}

const logKey = (ev: React.KeyboardEvent<HTMLInputElement>) => {
    console.log(ev.key)
}

const StatelessInput = (props: InputProps) => {
    return <input type="text" 
                  name={props.name} 
                  placeholder={props.placeholder}
                  value={props.value}
                  className={`crx-input ${props.className ? props.className : ''}`}  
                  onChange={props.changeHandler}
                  onKeyDown={props.keydownHandler || logKey} />
}

export default StatelessInput 