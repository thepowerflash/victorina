import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Modal from './../modal/Modal';
import './gemePage.css';
import { useScore } from './../scorecontext/ScoreContext';

const fetchQuestions = async () => {
  const response = await fetch('https://opentdb.com/api.php?amount=500');
  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('Too many requests. Please try again later.');
    } else {
      throw new Error('Network response was not ok');
    }
  }
  const data = await response.json();

  const categories = Array.from(new Set(data.results.map(question => question.category)));
  const limitedCategories = categories.slice(0, 5);
  const limitedQuestions = [];
  limitedCategories.forEach(category => {
    const categoryQuestions = data.results.filter(question => question.category === category);
    limitedQuestions.push(...categoryQuestions.slice(0, 5));
  });

  return { results: limitedQuestions, categories: limitedCategories };
};

const Quiz = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['questions'],
    queryFn: fetchQuestions,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error.message.includes('Too many requests')) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [results, setResults] = useState([]);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const { userScore, setUserScore } = useScore();

  useEffect(() => {
    console.log("Questions data:", data);
  }, [data]);

  const handleAnswerChange = (answer) => {
    setUserAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    const currentQuestion = data.results[currentQuestionIndex];
    let correctAnswer;
    try {
      correctAnswer = decodeURIComponent(currentQuestion.correct_answer.toLowerCase());
    } catch (e) {
      console.error("Failed to decode URI component:", e);
      correctAnswer = currentQuestion.correct_answer.toLowerCase();
    }

    const result = userAnswer.toLowerCase() === correctAnswer;
    let points = 0;

    if (currentQuestion.difficulty === "easy") {
      points = 100;
    } else if (currentQuestion.difficulty === "medium") {
      points = 200;
    } else if (currentQuestion.difficulty === "hard") {
      points = 300;
    }

    if (result) {
      setUserScore((prevScore) => prevScore + points);
    } else {
      setUserScore((prevScore) => prevScore - points);
    }

    const newResults = [...results];
    newResults[currentQuestionIndex] = result;
    setResults(newResults);

    const newAnsweredQuestions = [...answeredQuestions, currentQuestionIndex];
    setAnsweredQuestions(newAnsweredQuestions);

    setCurrentQuestionIndex(null);
    setUserAnswer("");
  };

  const handleQuestionClick = (index) => {
    if (!answeredQuestions.includes(index)) {
      setCurrentQuestionIndex(index);
    }
  };

  const handleCloseModal = () => {
    setCurrentQuestionIndex(null);
    setUserAnswer("");
  };

  const handleTimeOut = () => {
    const currentQuestion = data.results[currentQuestionIndex];
    let points = 0;

    if (currentQuestion.difficulty === "easy") {
      points = 100;
    } else if (currentQuestion.difficulty === "medium") {
      points = 200;
    } else if (currentQuestion.difficulty === "hard") {
      points = 300;
    }

    setUserScore((prevScore) => prevScore - points);

    const newResults = [...results];
    newResults[currentQuestionIndex] = false;
    setResults(newResults);

    const newAnsweredQuestions = [...answeredQuestions, currentQuestionIndex];
    setAnsweredQuestions(newAnsweredQuestions);

    setCurrentQuestionIndex(null);
    setUserAnswer("");
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error.message}</p>;
  }

  const sortedQuestions = data.results.sort((a, b) => a.question.localeCompare(b.question));

  return (
    <div className='container'>
      <h1 className="h1">Своя Игра</h1>
      {/* <p>Player Name: </p> */}
      <div className="quiz-container">
  <div className="category-column">
    {data.categories.map((category, categoryIndex) => (
      <div className='category-collumn-inner' key={categoryIndex}>
        <h2>{category}</h2>
        <div className="category-row">
          {sortedQuestions.map((question, index) => (
            question.category === category && (
              <div key={index} className={`quiz-card ${currentQuestionIndex === index ? 'answered' : ''} ${results[index] !== undefined ? (results[index] ? 'correct' : 'incorrect') : ''}`} onClick={() => handleQuestionClick(index)}>
                <h3>{question.difficulty === "easy" ? 100 : question.difficulty === "medium" ? 200 : 300}</h3>
              </div>
            )
          ))}
        </div>
      </div>
    ))}
  </div>
</div>

      {/* <p>User Score: {userScore}</p> */}
      <Modal
        isOpen={currentQuestionIndex !== null}
        question={currentQuestionIndex !== null ? decodeURIComponent(sortedQuestions[currentQuestionIndex].question) : ""}
        userAnswer={userAnswer}
        onAnswerChange={handleAnswerChange}
        onSubmitAnswer={handleSubmitAnswer}
        handleCloseModal={handleCloseModal}
        onTimeOut={handleTimeOut}
      />
    </div>
  );
};

export default Quiz;
