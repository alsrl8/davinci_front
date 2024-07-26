import {Action, AppState} from "./components/Interface/types";
import React, {createContext, ReactNode, useContext, useReducer} from "react";

const initialState: AppState = {
    userInfo: null,
}

const AppContext = createContext<{
    state: AppState;
    dispatch: React.Dispatch<Action>;
}>({
    state: initialState,
    dispatch: () => undefined // dummy function
});

const reducer = (state: AppState, action: Action): AppState => {
    switch (action.type) {
        case 'SET_USER_INFO':
            return {...state, userInfo: action.payload};
        case 'CLEAR_USER_INFO':
            return {...state, userInfo: null};
        default:
            return state;
    }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <AppContext.Provider value={{state, dispatch}}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);