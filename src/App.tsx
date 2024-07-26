import React from 'react';
import './App.css';
import {ThemeProvider} from "./contexts/ThemeContext";
import Main from "./components/Main";
import RedirectToHTTPS from "./components/RedirectToHTTPS";
import {AppProvider} from "./AppContext";


const App = () => {

    return (
        <AppProvider>
            <div className="App-container">
                <RedirectToHTTPS/>
                <ThemeProvider>
                    <Main/>
                </ThemeProvider>
            </div>
        </AppProvider>
    );
};

export default App;
