import React from 'react';
import { useScore } from './../scorecontext/ScoreContext';
import './statisticsPage.css';

const StatisticsPage = () => {
  const { userScore } = useScore();

  return (
    <div className="statistics-container">
      <h1 className="statistics-title">Statistics Page</h1>
      <p className="user-score">User Score: {userScore}</p>
    </div>
  );
};

export default StatisticsPage;