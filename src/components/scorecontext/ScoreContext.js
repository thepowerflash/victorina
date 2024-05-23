import React, { createContext, useState, useContext } from 'react';

const ScoreContext = createContext();

export const useScore = () => {
  return useContext(ScoreContext);
};

export const ScoreProvider = ({ children }) => {
  const [userScore, setUserScore] = useState(0);

  return (
    <ScoreContext.Provider value={{ userScore, setUserScore }}>
      {children}
    </ScoreContext.Provider>
  );
};
