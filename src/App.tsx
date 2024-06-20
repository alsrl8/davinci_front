import React from 'react';
import './App.css';
import {ThemeProvider} from "./contexts/ThemeContext";
import Main from "./components/Main";
import RedirectToHTTPS from "./components/RedirectToHTTPS";

const App = () => {
    return (
        <div className="App-container">
            <RedirectToHTTPS/>
            <ThemeProvider>
                <Main/>
            </ThemeProvider>
        </div>
    );
};

export default App;
