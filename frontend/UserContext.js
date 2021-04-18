import React from 'react';

//Creates a context object
const UserContext = React.createContext();

//Pass states and function to an object
//Provider component that allows us to provide the context object with states and functions
export const UserProvider = UserContext.Provider;

export default UserContext;

