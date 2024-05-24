import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// import './App.css';

const Modal = ({ handleCloseModal, isOpen, question, userAnswer, onAnswerChange, onSubmitAnswer, onTimeOut }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    let interval;
    if (isOpen) {
      setTimeLeft(60);
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime === 0) {
            clearInterval(interval);
            onTimeOut();
            return 0;
          } else {
            return prevTime - 1;
          }
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, onTimeOut]);

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal_content">
        <div className="modal_content__inner">
          <h3>{question}</h3>
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => onAnswerChange(e.target.value)}
            className="answer-input"
          />
          <button onClick={onSubmitAnswer} className="submit-button">Ответить</button>
          <p>Осталось времени {timeLeft} сек</p>
        </div>
      </div>
      <button className="close_button" onClick={handleCloseModal}>&times;</button>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  question: PropTypes.string.isRequired,
  userAnswer: PropTypes.string.isRequired,
  onAnswerChange: PropTypes.func.isRequired,
  onSubmitAnswer: PropTypes.func.isRequired,
  handleCloseModal: PropTypes.func.isRequired,
  onTimeOut: PropTypes.func.isRequired,
};

export default Modal;