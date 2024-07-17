import { createContext, ReactNode, useContext, useState } from "react";


interface userContextInterface{
    userId: String;
    setUserId: React.Dispatch<React.SetStateAction<string>>;
}

const createUserContext = createContext<userContextInterface | undefined>(undefined);

interface userProviderInterface{
    children: ReactNode;
}

export function UserProvider ({children}: userProviderInterface){
    const [userId, setUserId] =  useState<string>('');
    return(
        <createUserContext.Provider value={{userId, setUserId}}>
            {children}
        </createUserContext.Provider>
    )
}


export function showUser(): userContextInterface{
    const context = useContext(createUserContext);
    if(!context){
        throw new Error('showUser deve ser usado dentro de um userProvider')
    }
    return context;
}