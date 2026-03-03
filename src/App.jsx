import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./App.css";
import ReactLogo from './assets/react.svg';


const SECTION1 = ["a", "b", "c", "d", "e", "f"];
const SECTION2 = ["A", "B", "C", "D", "E", "F"];

const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);

const Card = ({ card, handleClick, disabled }) => (
  <div className="card" onClick={() => !disabled && handleClick(card)}>
    <motion.div
      className="card-inner"
      animate={{ rotateY: card.flipped ? 180 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="front">{card.value}</div>
      <div className="back">?</div>
    </motion.div>
  </div>
);

export default function MemoryGame() {
  const [leftCards, setLeftCards] = useState([]);
  const [rightCards, setRightCards] = useState([]);
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [lockBoard, setLockBoard] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => startGame(), []);

  const startGame = () => {
    const shuffledLeft = shuffle(SECTION1).map((v, idx) => ({
      id: idx,
      value: v,
      flipped: false,
      matched: false,
    }));
    const shuffledRight = shuffle(SECTION2).map((v, idx) => ({
      id: idx,
      value: v,
      flipped: false,
      matched: false,
    }));

    setLeftCards(shuffledLeft);
    setRightCards(shuffledRight);
    setSelectedLeft(null);
    setSelectedRight(null);
    setLockBoard(false);
    setGameWon(false);
  };

  const handleClickLeft = (card) => {
    if (card.flipped || card.matched || lockBoard || selectedLeft) return;

    setLeftCards((prev) =>
      prev.map((c) => (c.id === card.id ? { ...c, flipped: true } : c))
    );
    setSelectedLeft(card);
  };

  const handleClickRight = (card) => {
    if (card.flipped || card.matched || lockBoard || selectedRight) return;

    setRightCards((prev) =>
      prev.map((c) => (c.id === card.id ? { ...c, flipped: true } : c))
    );
    setSelectedRight(card);
  };

  useEffect(() => {
    if (selectedLeft && selectedRight) {
      setLockBoard(true);
      const isMatch =
        selectedLeft.value.toLowerCase() === selectedRight.value.toLowerCase();

      if (isMatch) {
        setLeftCards((prev) =>
          prev.map((c) =>
            c.value === selectedLeft.value ? { ...c, matched: true } : c
          )
        );
        setRightCards((prev) =>
          prev.map((c) =>
            c.value.toLowerCase() === selectedRight.value.toLowerCase()
              ? { ...c, matched: true }
              : c
          )
        );
        resetTurn();
      } else {
        setTimeout(() => {
          setLeftCards((prev) =>
            prev.map((c) =>
              c.id === selectedLeft.id ? { ...c, flipped: false } : c
            )
          );
          setRightCards((prev) =>
            prev.map((c) =>
              c.id === selectedRight.id ? { ...c, flipped: false } : c
            )
          );
          resetTurn();
        }, 800);
      }
    }
  }, [selectedLeft, selectedRight]);

  const resetTurn = () => {
    setSelectedLeft(null);
    setSelectedRight(null);
    setLockBoard(false);
  };

  useEffect(() => {
    if (
      leftCards.length &&
      rightCards.length &&
      leftCards.every((c) => c.matched) &&
      rightCards.every((c) => c.matched)
    ) {
      setGameWon(true);
    }
  }, [leftCards, rightCards]);

  return (
    <div className="game-container">
      <h1>Match Lowercase ↔ Uppercase</h1>
      <div className="game-board">
        <div className="section">
          {leftCards.map((card) => (
            <Card
              key={card.id}
              card={card}
              handleClick={handleClickLeft}
              disabled={lockBoard || selectedLeft}
            />
          ))}
        </div>

        <div className="divider"></div>

        <div className="section">
          {rightCards.map((card) => (
            <Card
              key={card.id}
              card={card}
              handleClick={handleClickRight}
              disabled={lockBoard || selectedRight}
            />
          ))}
        </div>
      </div>

      {gameWon && <h2 className="win">🎉 You Won!</h2>}

      <button className="restart-btn" onClick={startGame}>
        Restart Game
      </button>
      <br/>
      <br/>
    </div>
  );
}