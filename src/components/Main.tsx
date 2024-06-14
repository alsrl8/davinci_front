import React, {useEffect} from 'react';

import {useTheme} from "../contexts/ThemeContext";
import DarkModeSwitch from "./DrakModeSwitch/DarkModeSwitch";
import Chat from "./Chat/Chat";


const Main = () => {
    const {isDarkMode, toggleTheme} = useTheme();

    useEffect(() => {
        document.body.className = isDarkMode ? 'dark-mode' : 'light-mode';
    }, [isDarkMode]);

    return (
        <div>
            <Chat />
            <DarkModeSwitch toggleTheme={toggleTheme}/>
        </div>
    );
};

export default Main;
