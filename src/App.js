import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar/NavBar';
import GamePage from './components/gamepage/GamePage';
import StatisticsPage from './components/statisticspage/StatisticsPage';
import PlayerNameInput from './components/nameInput/NameInput';
import { ScoreProvider } from './components/scorecontext/ScoreContext';

const App = () => {
  const [playerName, setPlayerName] = useState("");
  const [isNameSet, setIsNameSet] = useState(false);

  const handleNameSubmit = (name) => {
    setPlayerName(name);
    setIsNameSet(true);
  };

  return (
    <ScoreProvider>
      <Router>
        <div>
          {!isNameSet && <PlayerNameInput onNameSubmit={handleNameSubmit} />}
          {isNameSet && (
            <>
              <Navbar />
              <Routes>
                <Route path="/" element={<GamePage />} />
                <Route path="/about" element={<StatisticsPage />} />
              </Routes>
            </>
          )}
        </div>
      </Router>
    </ScoreProvider>
  );
};

export default App;
