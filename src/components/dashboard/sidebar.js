import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css';
import '../../stylesheets/sidebar.css';

const Sidebar = ({ handleComponentSelect }) => {

    const [activeFlag, setActiveFlag] = useState('');
    const navigate = useNavigate();
    const sidebarMenu = [
        { id: 'Customers', condition: true, Flag: 'Customers', icon: 'customers-icon.svg', text: 'Customers' },
        { id: 'Airbnb', condition: true, Flag: 'Airbnb', icon: 'airbnb-icon.svg', text: 'Airbnb' },
        { id: 'Movies', condition: true, Flag: 'Movies', icon: 'movies-icon.svg', text: 'Movies' },
    ];

    const tabClick = (tabId) => {
        localStorage.setItem('activeLink', tabId);

        // Update the active flag
        setActiveFlag(tabId);

        // Navigate to the respective page
        navigate(`/Dashboard/${tabId}`);


        handleComponentSelect(tabId)
    };

    return (
        <div className='row'>
            <div id="14993" className="flex-grow-1">
                <ul className="sideMenuList" id="mainlist">
                    {sidebarMenu.map((item) =>
                        item.condition ? (
                            <li className="menuRow menu-item " id={item.id} key={item.id} onClick={() => tabClick(item.id)}>
                                <a className={`flex flex-col  items-center ${item.id === activeFlag ? 'active' : ''}`}>
                                    <img src={`/images/${item.icon}`} className="iconsize" alt="" />
                                    <p className="m-0">
                                        <span className="icontext">{item.text}</span>
                                    </p>
                                </a>
                            </li>
                        ) : null
                    )}
                </ul>
            </div>
        </div>
    )
}

export default Sidebar;