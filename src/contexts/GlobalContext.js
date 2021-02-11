import React, { useContext, useState } from 'react';

const GlobalContext = React.createContext();

export function useGlobal() {
    return useContext(GlobalContext);
};

export default function GlobalProvider({ children }) {
    const [situation, setSituation] = useState(null);

    const value = {
        situation,
        setSituation
    };

    return (
        <GlobalContext.Provider value={value}>
            {children}
        </GlobalContext.Provider>
    );
};
