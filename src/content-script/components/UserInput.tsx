import React, { ReactEventHandler } from 'react';
import { noop } from '../../modules/functions'

type InputProps = {
    placeholder: string;
    name: string;
    value: string;
    changeHandler: ReactEventHandler;
    className?: string;
    keydownHandler?: ReactEventHandler;
    blurHandler?: ReactEventHandler;
}

const UserInput = (props: InputProps) => {
    return <input type="text" 
                  name={props.name} 
                  placeholder={props.placeholder}
                  value={props.value}
                  className={`crx-input ${props.className ? props.className : ''}`}
                  onBlur={props.blurHandler || noop}  
                  onChange={props.changeHandler}
                  onKeyDown={props.keydownHandler || noop} />
}

export default UserInput 