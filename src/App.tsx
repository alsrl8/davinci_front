import React from 'react';
import './App.css';
import {ThemeProvider} from "./contexts/ThemeContext";
import Main from "./components/Main";

const App = () => {
    return (
        <ThemeProvider>
            <Main/>
        </ThemeProvider>
    );
};

export default App;
