import React from 'react'

type ListItemProps = {
    children: React.ReactNode;
    className?: string;
}

const ListItem = (props: ListItemProps) => {
    return <li className={`${props.className ? props.className : ''}`}>
                { props.children }
            </li>
}

export default ListItem