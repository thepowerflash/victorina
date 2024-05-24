import React, { useState } from 'react';
import './name-input.css';

const PlayerNameInput = ({ onNameSubmit }) => {
  const [playerName, setPlayerName] = useState("");
  const [error, setError] = useState("");

  const validateName = (name) => {
    const regex = /^[a-zA-Z0-9_А-Яа-я]+$/;
    return regex.test(name);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateName(playerName)) {
      onNameSubmit(playerName);
    } else {
      setError("Неккоректное имя ,попробуйте еще !!!");
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Напишите свое имя</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
          />
          <button type="submit">Начать игру</button>
          {error && <p>{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default PlayerNameInput;
